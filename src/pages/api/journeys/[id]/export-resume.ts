import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from '@/lib/services/journey.service';
import { getSessionUser } from '@/lib/auth/api-helpers';
import { documentService } from '@/lib/document/document.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const user = await getSessionUser(req, res);
  if (!user) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid journey ID' });
  }

  try {
    const journey = await journeyService.findById(id);
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    if (journey.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!journey.tailoredResume) {
      return res.status(404).json({ error: 'Tailored resume not yet generated' });
    }

    const buffer = await documentService.createResumeDoc(journey.tailoredResume);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="tailored-resume.docx"');
    return res.status(200).send(buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export resume';
    res.status(
      error instanceof Error && error.message === 'Access denied' ? 403
      : error instanceof Error && error.message === 'Journey not found' ? 404
      : 500
    ).json({ error: message });
  }
}

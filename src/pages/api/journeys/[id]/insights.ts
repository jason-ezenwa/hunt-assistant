import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from '@/lib/services/journey.service';
import { aiService } from '@/lib/ai/ai.service';
import { getSessionUser } from '@/lib/auth/api-helpers';

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
    const existingJourney = await journeyService.findById(id);
    if (!existingJourney) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    if (existingJourney.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { insights } = await aiService.generateInsights({
      resumeText: existingJourney.resumeText,
      jobDescription: existingJourney.jobDescription,
    });

    // Update journey with insights
    await journeyService.update(id, { insights });

    res.status(200).json({ message: 'Insights generated successfully' });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
}

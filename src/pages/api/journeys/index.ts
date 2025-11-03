import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from '@/lib/services/journey.service';
import { createJourneySchema } from '@/lib/validations/journey.schemas';
import { getSessionUser } from '@/lib/auth/api-helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getSessionUser(req, res);
  if (!user) return;

  switch (req.method) {
    case 'GET':
      try {
        const journeys = await journeyService.findByUserId(user.id);
        res.status(200).json(journeys);
      } catch (error) {
        console.error('Error fetching journeys:', error);
        res.status(500).json({ error: 'Failed to fetch journeys' });
      }
      break;

    case 'POST':
      try {
        const validationResult = createJourneySchema.safeParse(req.body);
        if (!validationResult.success) {
          return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.errors
          });
        }

        const journeyData = {
          ...validationResult.data,
          userId: user.id,
        };

        const journey = await journeyService.create(journeyData);
        res.status(201).json(journey);
      } catch (error) {
        console.error('Error creating journey:', error);
        res.status(500).json({ error: 'Failed to create journey' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from '@/lib/services/journey.service';
import { updateJourneySchema } from '@/lib/validations/journey.schemas';
import { getSessionUser } from '@/lib/auth/api-helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getSessionUser(req, res);
  if (!user) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid journey ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const journey = await journeyService.findById(id);

        if (!journey) {
          return res.status(404).json({ error: 'Journey not found' });
        }

        // Check if user owns this journey
        if (journey.userId !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json(journey);
      } catch (error) {
        console.error('Error fetching journey:', error);
        res.status(500).json({ error: 'Failed to fetch journey' });
      }
      break;

    case 'PATCH':
      try {
        const validationResult = updateJourneySchema.safeParse(req.body);
        if (!validationResult.success) {
          return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.errors
          });
        }

        const existingJourney = await journeyService.findById(id);
        if (!existingJourney) {
          return res.status(404).json({ error: 'Journey not found' });
        }

        if (existingJourney.userId !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        const updatedJourney = await journeyService.update(id, validationResult.data);

        if (!updatedJourney) {
          return res.status(404).json({ error: 'Journey not found after update' });
        }

        res.status(200).json(updatedJourney);
      } catch (error) {
        console.error('Error updating journey:', error);
        res.status(500).json({ error: 'Failed to update journey' });
      }
      break;

    case 'DELETE':
      try {
        const existingJourney = await journeyService.findById(id);
        if (!existingJourney) {
          return res.status(404).json({ error: 'Journey not found' });
        }

        if (existingJourney.userId !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        await journeyService.delete(id);
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting journey:', error);
        res.status(500).json({ error: 'Failed to delete journey' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { JourneyData } from '@/lib/db/models/journey.model';

// Input types derived from base JourneyData interface
export interface CreateJourneyInput extends Omit<JourneyData, 'insights' | 'coverLetter' | 'status'> {
  userId: string; // Required for creation
  insights?: JourneyData['insights']; // Optional for creation
  coverLetter?: JourneyData['coverLetter']; // Optional for creation
  status?: JourneyData['status']; // Optional for creation (defaults to 'draft')
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateJourneyInput extends Partial<Omit<JourneyData, 'userId'>> {
  // All fields optional for updates, userId cannot be changed
}

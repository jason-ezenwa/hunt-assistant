import { JourneyData } from '@/lib/db/models/journey.model';

// Input types derived from base JourneyData interface
export interface CreateJourneyInput
  extends Omit<JourneyData, "insights" | "coverLetter" | "status"> {
  userId: string;
  resumeText: string;
  jobDescription: string;
  resumeFileName: string;
  insights?: JourneyData["insights"];
  coverLetter?: JourneyData["coverLetter"];
  status?: JourneyData["status"];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateJourneyInput
  extends Partial<Omit<JourneyData, "userId">> {}

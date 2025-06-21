import { GenerateCoverLetterDto, GenerateInsightsDto } from "./types";

export interface IAiService {
  generateInsights(data: GenerateInsightsDto): Promise<{ insights: string }>;
  generateCoverLetter(
    data: GenerateCoverLetterDto
  ): Promise<{ coverLetter: string }>;
} 
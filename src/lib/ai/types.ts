import { z } from "zod";

export const generateInsightsSchema = z.object({
  resumeText: z.string().min(1, "Resume text cannot be empty."),
  jobDescription: z.string().min(1, "Job description cannot be empty."),
});

export type GenerateInsightsDto = z.infer<typeof generateInsightsSchema>;

export const generateCoverLetterSchema = z.object({
  resumeText: z.string().min(1, "Resume text cannot be empty."),
  jobDescription: z.string().min(1, "Job description cannot be empty."),
});

export type GenerateCoverLetterDto = z.infer<typeof generateCoverLetterSchema>; 
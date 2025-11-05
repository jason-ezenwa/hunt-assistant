import { z } from 'zod';

// Frontend form validation schema (what user inputs)
export const journeyFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  resumeFileName: z.string().min(1, "Resume file name is required"),
});

// Backend API validation schema (includes userId)
export const createJourneySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  resumeFileName: z.string().min(1, "Resume file name is required"),
  resumeText: z.string(),
  insights: z.string().nullable().optional(),
  coverLetter: z.string().nullable().optional(),
  status: z
    .enum(["draft", "in-progress", "completed", "applied", "archived"])
    .optional(),
});

export const updateJourneySchema = z.object({
  companyName: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  jobDescription: z.string().min(50).optional(),
  resumeFileName: z.string().min(1).optional(),
  insights: z.string().nullable().optional(),
  coverLetter: z.string().nullable().optional(),
  status: z
    .enum(["draft", "in-progress", "completed", "applied", "archived"])
    .optional(),
});

// Form data type (frontend)
export type JourneyFormData = z.infer<typeof journeyFormSchema>;
export type UpdateJourneyFormData = z.infer<typeof updateJourneySchema>;

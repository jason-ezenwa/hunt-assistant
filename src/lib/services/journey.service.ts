import { JourneyModel, JourneyObject } from '@/lib/db/models/journey.model';
import { CreateJourneyInput, UpdateJourneyInput } from '@/lib/dtos/journeys/inputs.dto';
import { JourneyClient } from '@/lib/db/models/journey.model';
import { IAiService } from "@/lib/ai/ai.interface";
import { ResumeService } from "@/lib/resume/resume.service";

export class JourneyService {
  constructor(
    private aiService: IAiService,
    private resumeService: ResumeService
  ) {}

  /**
   * Extracts the text from a resume file using the resume service.
   * @param fileBuffer
   * @param mimeType
   * @returns
   */
  async extractResumeText(
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const { text } = await this.resumeService.getText(fileBuffer, mimeType);
    return text;
  }

  async create(data: CreateJourneyInput): Promise<JourneyClient> {
    try {
      // Generate insights as part of journey creation business logic
      const result = await this.aiService.generateInsights({
        resumeText: data.resumeText,
        jobDescription: data.jobDescription,
      });

      const insights = result.insights;
      const status = "in-progress";

      const journey = await JourneyModel.create({
        ...data,
        insights,
        status,
      });
      const journeyObj = journey.toObject() as JourneyObject;

      return {
        _id: journeyObj._id.toString(),
        userId: journeyObj.userId,
        companyName: journeyObj.companyName,
        jobTitle: journeyObj.jobTitle,
        jobDescription: journeyObj.jobDescription,
        resumeFileName: journeyObj.resumeFileName,
        resumeText: journeyObj.resumeText,
        insights: journeyObj.insights,
        coverLetter: journeyObj.coverLetter,
        status: journeyObj.status,
        createdAt: journeyObj.createdAt.toISOString(),
        updatedAt: journeyObj.updatedAt.toISOString(),
      };
    } catch (error) {
      logEvent("error", "Error creating journey", { error });
      throw new Error("Failed to create journey");
    }
  }

  async findByUserId(userId: string): Promise<JourneyClient[]> {
    const journeys = await JourneyModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return journeys.map((journey) => ({
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<JourneyClient | null> {
    const journey = await JourneyModel.findById(id).lean();
    if (!journey) return null;

    return {
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    };
  }

  async update(
    id: string,
    data: UpdateJourneyInput
  ): Promise<JourneyClient | null> {
    const journey = await JourneyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!journey) return null;

    return {
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    };
  }

  /**
   * Generates insights for a journey using the AI service.
   * @param journeyId
   * @param userId
   * @returns
   */
  async generateInsights(journeyId: string, userId: string): Promise<void> {
    try {
      const existingJourney = await this.findById(journeyId);
      if (!existingJourney) {
        throw new Error("Journey not found");
      }

      if (existingJourney.userId !== userId) {
        throw new Error("Access denied");
      }

      const { insights } = await this.aiService.generateInsights({
        resumeText: existingJourney.resumeText,
        jobDescription: existingJourney.jobDescription,
      });

      await this.update(journeyId, { insights });
    } catch (error) {
      logEvent("error", "Error generating insights", { error });
      throw new Error("Failed to generate insights");
    }
  }

  /**
   * Generates a cover letter for a journey using the AI service.
   * @param journeyId
   * @param userId
   * @returns
   */
  async generateCoverLetter(journeyId: string, userId: string): Promise<void> {
    const existingJourney = await this.findById(journeyId);
    if (!existingJourney) {
      throw new Error("Journey not found");
    }

    if (existingJourney.userId !== userId) {
      throw new Error("Access denied");
    }

    const { coverLetter } = await this.aiService.generateCoverLetter({
      resumeText: existingJourney.resumeText,
      jobDescription: existingJourney.jobDescription,
    });

    await this.update(journeyId, { coverLetter });
  }

  async delete(id: string): Promise<void> {
    await JourneyModel.findByIdAndDelete(id);
  }
}

import { aiService } from "@/lib/ai/ai.service";
import { resumeService } from "@/lib/resume/resume.service";
import { logEvent } from "../core/logger";

export const journeyService = new JourneyService(aiService, resumeService);

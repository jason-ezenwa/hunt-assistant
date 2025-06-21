import OpenAI from "openai";
import { logEvent } from "../core/logger";
import { IAiService } from "./ai.interface";
import { GenerateCoverLetterDto, GenerateInsightsDto } from "./types";
import {
  constructCoverLetterMessages,
  constructInsightsMessages,
} from "./utils";

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService implements IAiService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables.");
    }
  }

  async generateInsights(
    data: GenerateInsightsDto
  ): Promise<{ insights: string }> {
    try {
      logEvent("info", "Generating insights from OpenAI");
      const { resumeText, jobDescription } = data;
      const messages = constructInsightsMessages(resumeText, jobDescription);

      const completion = await openAI.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
      });

      const insights = completion.choices[0]?.message?.content || "";
      logEvent("info", "Successfully generated insights from OpenAI");
      return { insights };
    } catch (error) {
      logEvent("error", "Error generating insights from OpenAI", { error });
      throw new Error("Failed to generate insights from OpenAI.");
    }
  }

  async generateCoverLetter(
    data: GenerateCoverLetterDto
  ): Promise<{ coverLetter: string }> {
    try {
      const { resumeText, jobDescription } = data;
      const messages = constructCoverLetterMessages(resumeText, jobDescription);

      const completion = await openAI.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
      });

      const coverLetter = completion.choices[0]?.message?.content || "";
      logEvent("info", "Successfully generated cover letter from OpenAI");
      return { coverLetter };
    } catch (error) {
      logEvent("error", "Error generating cover letter from OpenAI", { error });
      throw new Error("Failed to generate cover letter from OpenAI.");
    }
  }
}

export const openAIService = new OpenAIService();

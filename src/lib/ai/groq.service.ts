import Groq from "groq-sdk";
import { logEvent } from "../core/logger";
import { IAiService } from "./ai.interface";
import { GenerateCoverLetterDto, GenerateInsightsDto } from "./types";
import {
  constructCoverLetterMessages,
  constructInsightsMessages,
} from "./utils";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class GroqService implements IAiService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables.");
    }
  }

  async generateInsights(
    data: GenerateInsightsDto
  ): Promise<{ insights: string }> {
    try {
      logEvent("info", "Generating insights from Groq");
      const { resumeText, jobDescription } = data;
      const messages = constructInsightsMessages(resumeText, jobDescription);
      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
      });

      const insights = completion.choices[0]?.message?.content || "";
      logEvent("info", "Successfully generated insights from Groq");
      return { insights };
    } catch (error) {
      logEvent("error", "Error generating insights from Groq", { error });
      throw new Error("Failed to generate insights from Groq.");
    }
  }

  async generateCoverLetter(
    data: GenerateCoverLetterDto
  ): Promise<{ coverLetter: string }> {
    try {
      logEvent("info", "Generating cover letter from Groq");
      const { resumeText, jobDescription } = data;
      const messages = constructCoverLetterMessages(resumeText, jobDescription);

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
      });

      const coverLetter = completion.choices[0]?.message?.content || "";
      logEvent("info", "Successfully generated cover letter from Groq");
      return { coverLetter };
    } catch (error) {
      logEvent("error", "Error generating cover letter from Groq", { error });
      throw new Error("Failed to generate cover letter from Groq.");
    }
  }
}

export const groqService = new GroqService();

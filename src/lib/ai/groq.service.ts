import Groq from "groq-sdk";
import { logEvent } from "../core/logger";
import { IAiService } from "./ai.interface";
import { GenerateCoverLetterDto, GenerateInsightsDto } from "./types";
import { constructCoverLetterPrompt, constructInsightsPrompt } from "./utils";

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
      const prompt = constructInsightsPrompt(resumeText, jobDescription);

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
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
      const { resumeText, jobDescription } = data;
      const prompt = constructCoverLetterPrompt(resumeText, jobDescription);

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      });

      const coverLetter = completion.choices[0]?.message?.content || "";
      return { coverLetter };
    } catch (error) {
      logEvent("error", "Error generating cover letter from Groq", { error });
      throw new Error("Failed to generate cover letter from Groq.");
    }
  }
}

export const groqService = new GroqService();

import { logEvent } from "../core/logger";
import { IAiService } from "./ai.interface";
import { groqService } from "./groq.service";
import { openAIService } from "./openai.service";

class AIService {
  private service: IAiService;

  constructor() {
    const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || "groq";

    if (aiProvider === "groq") {
      this.service = groqService;
      logEvent("info", "Using Groq AI Service");
    } else {
      this.service = openAIService;
      logEvent("info", "Using OpenAI AI Service");
    }
  }

  getService(): IAiService {
    return this.service;
  }
}

export const aiService = new AIService().getService();

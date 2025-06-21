import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { aiService } from "@/lib/ai/ai.service";
import { generateInsightsSchema } from "@/lib/ai/types";
import { BadRequestError, NotFoundError } from "@/lib/core/errors";
import { logEvent } from "@/lib/core/logger";
import { validateWithSchema } from "@/lib/core/validation";
import { resumeService } from "@/lib/resume/resume.service";

// Define multer storage options
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper to run middleware
const runMiddleware = (
  req: NextApiRequest & { file?: any },
  res: NextApiResponse,
  fn: any
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for file uploads
  },
};

const handler = async (
  req: NextApiRequest & { file?: any },
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await runMiddleware(req, res, upload.single("resume"));

    const resumeFile = req.file;
    if (!resumeFile) {
      throw new BadRequestError("Resume file is required.");
    }

    const { text: resumeText } = await resumeService.getText(
      resumeFile.buffer,
      resumeFile.mimetype
    );

    const dto = validateWithSchema(generateInsightsSchema, {
      resumeText,
      jobDescription: req.body.jobDescription,
    });

    const result = await aiService.generateInsights(dto);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      logEvent("error", "Error in generate-insights handler", {
        error: error.message,
      });
      return res.status(error.statusCode).json({ error: error.message });
    }

    logEvent("error", "Error in generate-insights handler", {
      error,
    });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

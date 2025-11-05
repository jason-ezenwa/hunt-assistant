import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from '@/lib/services/journey.service';
import { createJourneySchema } from '@/lib/validations/journey.schemas';
import { getSessionUser } from "@/lib/auth/api-helpers";
import multer from "multer";
import { logEvent } from "@/lib/core/logger";

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

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest & { file?: any },
  res: NextApiResponse
) {
  await dbConnect();

  const user = await getSessionUser(req, res);
  if (!user) return;

  switch (req.method) {
    case "GET":
      try {
        const journeys = await journeyService.findByUserId(user.id);
        res.status(200).json(journeys);
      } catch (error) {
        logEvent("error", "Error fetching journeys", { error });
        res.status(500).json({ error: "Failed to fetch journeys" });
      }
      break;

    case "POST":
      try {
        // 1. Handle file upload
        await runMiddleware(req, res, upload.single("resume"));
        const resumeFile = req.file;

        if (!resumeFile) {
          return res.status(400).json({ error: "Resume file is required" });
        }

        // 2. Extract resume text
        const resumeText = await journeyService.extractResumeText(
          resumeFile.buffer,
          resumeFile.mimetype
        );

        // 3. Prepare journey data
        const journeyData = {
          companyName: req.body.companyName,
          jobTitle: req.body.jobTitle,
          jobDescription: req.body.jobDescription,
          resumeFileName: resumeFile.originalname,
          resumeText: resumeText,
          userId: user.id,
        };

        // 4. Validate data
        const validationResult = createJourneySchema.safeParse(journeyData);
        if (!validationResult.success) {
          return res.status(400).json({
            error: "Validation failed",
            details: validationResult.error.errors,
          });
        }

        // 5. Create journey
        const journey = await journeyService.create(validationResult.data);
        res.status(201).json(journey);
      } catch (error) {
        logEvent("error", "Error creating journey", { error });
        res.status(500).json({ error: "Failed to create journey" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

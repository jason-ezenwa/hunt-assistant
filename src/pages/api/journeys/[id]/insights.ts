import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db/mongodb';
import { journeyService } from "@/lib/services/journey.service";
import { getSessionUser } from "@/lib/auth/api-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const user = await getSessionUser(req, res);
  if (!user) return;

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid journey ID" });
  }

  try {
    await journeyService.generateInsights(id, user.id);
    res.status(200).json({ message: "Insights generated successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate insights";
    res
      .status(
        error instanceof Error && error.message === "Access denied"
          ? 403
          : error instanceof Error && error.message === "Journey not found"
          ? 404
          : 500
      )
      .json({ error: message });
  }
}

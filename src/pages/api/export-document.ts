import { NextApiRequest, NextApiResponse } from "next";
import { documentService } from "@/lib/document/document.service";
import { BadRequestError, NotFoundError } from "@/lib/core/errors";
import { logEvent } from "@/lib/core/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      throw new BadRequestError("Content for the document must be provided.");
    }

    const buffer = await documentService.createCoverLetterDoc(content);

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="cover-letter.docx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      logEvent("error", "Error in export-document handler", {
        error: error.message,
      });
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error instanceof BadRequestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    logEvent("error", "Error in export-document handler", {
      error,
    });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

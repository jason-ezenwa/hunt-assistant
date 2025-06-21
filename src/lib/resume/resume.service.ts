import mammoth from "mammoth";
import pdf from "pdf-parse";
import { BadRequestError } from "../core/errors";

class ResumeService {
  async getText(
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ text: string }> {
    if (mimeType === "application/pdf") {
      const data = await pdf(fileBuffer);
      return { text: data.text };
    }

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return { text: result.value };
    }

    throw new BadRequestError(
      "Unsupported file type. Please upload a PDF or DOCX file."
    );
  }
}

export const resumeService = new ResumeService(); 
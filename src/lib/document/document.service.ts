import { Document, Packer, Paragraph, TextRun } from "docx";

class DocumentService {
  async createCoverLetterDoc(content: string): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}

export const documentService = new DocumentService(); 
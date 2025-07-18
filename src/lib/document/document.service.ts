import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { marked, Token, Tokens } from "marked";

class DocumentService {
  async createCoverLetterDoc(content: string): Promise<Buffer> {
    // Parse markdown into tokens
    const tokens = marked.lexer(content);
    const paragraphs = this.convertTokensToParagraphs(tokens);

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  private convertTokensToParagraphs(tokens: Token[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case "heading":
          paragraphs.push(this.createHeading(token.text, token.depth));
          break;
        case "paragraph":
          paragraphs.push(this.createParagraph(token.text));
          break;
        case "list":
          paragraphs.push(...this.createList(token));
          break;
        case "space":
          // Add a blank paragraph for spacing
          paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
          break;
        default:
          // For other token types, treat as regular paragraph
          if ("text" in token) {
            paragraphs.push(this.createParagraph(token.text));
          }
          break;
      }
    }

    return paragraphs;
  }

  private createHeading(text: string, depth: number): Paragraph {
    const headingLevel = this.getHeadingLevel(depth);
    const textRuns = this.parseInlineFormatting(text);

    return new Paragraph({
      heading: headingLevel,
      children: textRuns,
    });
  }

  private createParagraph(text: string): Paragraph {
    const textRuns = this.parseInlineFormatting(text);
    return new Paragraph({
      children: textRuns,
      spacing: { after: 200 }, // Add some spacing after paragraphs
    });
  }

  private createList(listToken: Tokens.List | Tokens.Generic): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    for (const item of listToken.items) {
      const text = item.text;
      const textRuns = this.parseInlineFormatting(text);

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun("• "), // Simple bullet point
            ...textRuns,
          ],
          indent: { left: 400 }, // Indent list items
          spacing: { after: 100 },
        })
      );
    }

    return paragraphs;
  }

  private parseInlineFormatting(text: string): TextRun[] {
    const textRuns: TextRun[] = [];
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/);

    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Bold text
        textRuns.push(
          new TextRun({
            text: part.slice(2, -2),
            bold: true,
          })
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        // Italic text
        textRuns.push(
          new TextRun({
            text: part.slice(1, -1),
            italics: true,
          })
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        // Code text
        textRuns.push(
          new TextRun({
            text: part.slice(1, -1),
            font: "Courier New",
          })
        );
      } else if (part.trim()) {
        // Regular text
        textRuns.push(new TextRun(part));
      }
    }

    return textRuns;
  }

  private getHeadingLevel(depth: number) {
    switch (depth) {
      case 1:
        return HeadingLevel.HEADING_1;
      case 2:
        return HeadingLevel.HEADING_2;
      case 3:
        return HeadingLevel.HEADING_3;
      case 4:
        return HeadingLevel.HEADING_4;
      case 5:
        return HeadingLevel.HEADING_5;
      default:
        return HeadingLevel.HEADING_6;
    }
  }
}

export const documentService = new DocumentService();

import { Document, Packer, Paragraph, TextRun, BorderStyle } from "docx";
import { marked, Token, Tokens } from "marked";

// Half-points (docx unit): 1pt = 2 half-points
const PT = (pt: number) => pt * 2;

class DocumentService {
  async createResumeDoc(content: string): Promise<Buffer> {
    const tokens = marked.lexer(content);
    const paragraphs = this.convertResumeTokensToParagraphs(tokens);

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Times New Roman", size: PT(11.5) },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 900, right: 900 }, // 0.5in top/bot, 0.625in sides
            },
          },
          children: paragraphs,
        },
      ],
    });

    return Packer.toBuffer(doc);
  }

  private convertResumeTokensToParagraphs(tokens: Token[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case "heading":
          paragraphs.push(...this.createResumeHeading(token.text, token.depth));
          break;
        case "paragraph":
          // Split on newlines so each skill line gets its own paragraph
          for (const line of token.text.split("\n")) {
            const trimmed = line.trim();
            if (trimmed) {
              paragraphs.push(this.createResumeParagraph(trimmed));
            }
          }
          break;
        case "list":
          paragraphs.push(...this.createResumeList(token));
          break;
        case "space":
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
          break;
        default:
          if ("text" in token && token.text) {
            for (const line of (token.text as string).split("\n")) {
              const trimmed = line.trim();
              if (trimmed) paragraphs.push(this.createResumeParagraph(trimmed));
            }
          }
          break;
      }
    }

    return paragraphs;
  }

  private createResumeHeading(text: string, depth: number): Paragraph[] {
    if (depth === 1) {
      // Name — large, bold, centered
      return [
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [new TextRun({ text, bold: true, size: PT(12), font: "Times New Roman" })],
        }),
      ];
    }

    if (depth === 2) {
      // Section header — bold, ALL CAPS (already literal), with border below
      return [
        new Paragraph({
          spacing: { before: 160, after: 40 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 },
          },
          children: [new TextRun({ text: text.toUpperCase(), bold: true, size: PT(11.5), font: "Times New Roman" })],
        }),
      ];
    }

    // H3 — job title / degree — bold
    return [
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [new TextRun({ text, bold: true, size: PT(11.5), font: "Times New Roman" })],
      }),
    ];
  }

  private createResumeParagraph(text: string): Paragraph {
    const textRuns = this.parseInlineFormatting(text, PT(11.5));
    return new Paragraph({
      children: textRuns,
      spacing: { before: 0, after: 40 },
    });
  }

  private createResumeList(listToken: Tokens.List | Tokens.Generic): Paragraph[] {
    return listToken.items.map((item: Tokens.ListItem) =>
      new Paragraph({
        children: [
          new TextRun({ text: "\u2022 ", size: PT(11.5), font: "Times New Roman" }),
          ...this.parseInlineFormatting(item.text, PT(11.5)),
        ],
        indent: { left: 360 },
        spacing: { before: 0, after: 40 },
      })
    );
  }

  async createCoverLetterDoc(content: string): Promise<Buffer> {
    const tokens = marked.lexer(content);
    const paragraphs: Paragraph[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case "heading": {
          const bold = token.depth <= 2;
          const size = token.depth === 1 ? PT(14) : PT(12);
          paragraphs.push(
            new Paragraph({
              spacing: { before: 160, after: 80 },
              children: [new TextRun({ text: token.text, bold, size, font: "Times New Roman" })],
            })
          );
          break;
        }
        case "paragraph":
          paragraphs.push(
            new Paragraph({
              children: this.parseInlineFormatting(token.text, PT(12)),
              spacing: { after: 160 },
            })
          );
          break;
        case "list":
          for (const item of token.items) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "\u2022 ", size: PT(12), font: "Times New Roman" }),
                  ...this.parseInlineFormatting(item.text, PT(12)),
                ],
                indent: { left: 360 },
                spacing: { after: 80 },
              })
            );
          }
          break;
        case "space":
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
          break;
        default:
          if ("text" in token && token.text) {
            paragraphs.push(
              new Paragraph({
                children: this.parseInlineFormatting(token.text as string, PT(12)),
                spacing: { after: 160 },
              })
            );
          }
          break;
      }
    }

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Times New Roman", size: PT(12) },
          },
        },
      },
      sections: [{ children: paragraphs }],
    });

    return Packer.toBuffer(doc);
  }

  private parseInlineFormatting(text: string, size?: number): TextRun[] {
    const textRuns: TextRun[] = [];
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/);

    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**")) {
        textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true, ...(size && { size }) }));
      } else if (part.startsWith("*") && part.endsWith("*")) {
        textRuns.push(new TextRun({ text: part.slice(1, -1), italics: true, ...(size && { size }) }));
      } else if (part.startsWith("`") && part.endsWith("`")) {
        textRuns.push(new TextRun({ text: part.slice(1, -1), font: "Courier New", ...(size && { size }) }));
      } else if (part.trim()) {
        textRuns.push(new TextRun({ text: part, ...(size && { size }) }));
      }
    }

    return textRuns;
  }


}

export const documentService = new DocumentService();

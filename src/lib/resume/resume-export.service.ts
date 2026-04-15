import { JSDOM } from 'jsdom';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToDocx from 'html-to-docx';

// Register pdfmake virtual file system fonts
// vfs_fonts exports the VFS object directly (not nested under .pdfMake.vfs)
(pdfMake as typeof pdfMake & { vfs: Record<string, string> }).vfs =
  pdfFonts as unknown as Record<string, string>;

// Register font aliases so html-to-pdfmake conversions of font-family:'Times New Roman'
// (which becomes 'TimesNewRoman') don't throw "font not defined" errors.
pdfMake.addFonts({
  TimesNewRoman: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
  Times: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
  serif: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
});

/**
 * Converts an HTML string to a PDF buffer using html-to-pdfmake + pdfmake + jsdom.
 * Server-side only (Node.js runtime).
 */
export async function toPdf(html: string): Promise<Buffer> {
  const { window } = new JSDOM('');
  const content = htmlToPdfmake(html, { window });

  const docDefinition = {
    content,
    defaultStyle: {
      font: 'Roboto',
    },
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);
  return pdfDoc.getBuffer();
}

/**
 * Converts an HTML string to a DOCX buffer using html-to-docx.
 * Server-side only (Node.js runtime).
 */
export async function toDocx(html: string): Promise<Buffer> {
  const buffer = await htmlToDocx(html, undefined, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: false,
  });

  return buffer as Buffer;
}

// Turns the resume data into a PDF file with pdf-lib. Runs at build time only
// (see vite.config.ts); none of this code is sent to visitors' browsers.
//
// PDFs have no automatic text flow, so this file does its own layout:
// it measures each word, wraps lines, and starts a new page when one fills up.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Resume, ResumeEntry } from "./resume-data";

const PAGE = { width: 612, height: 792 }; // US Letter, in points (72 per inch)
const MARGIN = 54; // 0.75 inch
const WIDTH = PAGE.width - MARGIN * 2;
const INK = rgb(0.1, 0.12, 0.17);
const MUTED = rgb(0.35, 0.39, 0.46);
const ACCENT = rgb(0.11, 0.37, 0.82); // the site's light-mode blue

// Splits text into lines that each fit within maxWidth, breaking between pieces
// separated by `separator` (normally spaces, so it breaks between words).
function wrap(text: string, font: PDFFont, size: number, maxWidth: number, separator = " "): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(separator)) {
    const next = line ? `${line}${separator}${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function resumePdf(r: Resume): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${r.name} – Resume`);
  doc.setAuthor(r.name);

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  let page: PDFPage = doc.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - MARGIN;

  // Starts a new page if the next `needed` points won't fit on this one.
  function room(needed: number) {
    if (y - needed < MARGIN) {
      page = doc.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - MARGIN;
    }
  }

  // Draws wrapped text. With `bullet`, a dot goes beside the first line.
  function paragraph(text: string, font = regular, size = 10, color = INK, indent = 0, bullet = false) {
    const leading = size * 1.35;
    wrap(text, font, size, WIDTH - indent).forEach((line, i) => {
      room(leading);
      y -= leading;
      page.drawText(line, { x: MARGIN + indent, y, size, font, color });
      if (bullet && i === 0) {
        page.drawText("•", { x: MARGIN + 2, y, size, font: regular, color });
      }
    });
  }

  function heading(text: string) {
    room(30);
    y -= 18;
    page.drawText(text.toUpperCase(), { x: MARGIN, y, size: 10.5, font: bold, color: ACCENT });
    y -= 5;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + WIDTH, y },
      thickness: 0.75,
      color: ACCENT,
    });
    y -= 2;
  }

  function entry(e: ResumeEntry) {
    room(40);
    y -= 15;
    page.drawText(e.title, { x: MARGIN, y, size: 10.5, font: bold, color: INK });
    const datesWidth = regular.widthOfTextAtSize(e.dates, 10);
    page.drawText(e.dates, { x: MARGIN + WIDTH - datesWidth, y, size: 10, font: regular, color: MUTED });
    if (e.org) paragraph(e.org, italic, 10, MUTED);
    for (const b of e.bullets) paragraph(b, regular, 10, INK, 12, true);
  }

  // Header: name, then location and links on one line.
  y -= 22;
  page.drawText(r.name, { x: MARGIN, y, size: 22, font: bold, color: INK });
  // Wrap between items (not words), so no line ends with a dangling "·".
  const separator = "  ·  ";
  for (const line of wrap([r.location, ...r.links.map((l) => l.label)].join(separator), regular, 10, WIDTH, separator)) {
    y -= 13.5;
    page.drawText(line, { x: MARGIN, y, size: 10, font: regular, color: MUTED });
  }
  y -= 4;
  paragraph(r.summary);

  heading("Skills");
  for (const s of r.skills) paragraph(`${s.label}: ${s.items}`);

  heading("Projects");
  r.projects.forEach(entry);

  heading("Experience");
  r.experience.forEach(entry);

  heading("Education and training");
  r.education.forEach(entry);

  heading("Certifications");
  paragraph(r.certifications.join("  ·  "));

  return doc.save();
}

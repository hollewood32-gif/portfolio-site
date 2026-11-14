// Turns the resume data into the HTML for the page's Resume section.
// Runs at build time (see vite.config.ts), so the text is in the page itself:
// fast, and readable by search engines and screen readers without JavaScript.
import type { Resume, ResumeEntry } from "./resume-data";

// Makes text safe to put inside HTML (so "<" or "&" can't break the page).
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function entry(e: ResumeEntry): string {
  const bullets = e.bullets.length
    ? `<ul>${e.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
    : "";
  return `<div class="resume-entry">
  <div class="resume-entry-head"><h4>${escapeHtml(e.title)}</h4><span class="resume-dates">${escapeHtml(e.dates)}</span></div>
  ${e.org ? `<p class="resume-org">${escapeHtml(e.org)}</p>` : ""}
  ${bullets}
</div>`;
}

function group(title: string, body: string): string {
  return `<div class="resume-group"><h3>${escapeHtml(title)}</h3>${body}</div>`;
}

export function resumeHtml(r: Resume): string {
  const skills = `<dl class="resume-skills">${r.skills
    .map((s) => `<div><dt>${escapeHtml(s.label)}</dt><dd>${escapeHtml(s.items)}</dd></div>`)
    .join("")}</dl>`;

  return [
    `<p class="resume-summary">${escapeHtml(r.summary)}</p>`,
    group("Skills", skills),
    group("Projects", r.projects.map(entry).join("")),
    group("Experience", r.experience.map(entry).join("")),
    group("Education and training", r.education.map(entry).join("")),
    group("Certifications", `<p>${r.certifications.map(escapeHtml).join(" · ")}</p>`),
  ].join("\n");
}

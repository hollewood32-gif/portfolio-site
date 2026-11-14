// Builds the footer line, e.g. "© 2026 Jeffrey Doughty".
// Kept in its own file with no page code, so a test can check it.
export function footerText(year: number): string {
  return `© ${year} Jeffrey Doughty`;
}

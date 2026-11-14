// Outside-link check: finds every link to another website in the site's pages
// and visits each one. Links inside the site are already checked on every PR
// (src/page.test.ts); this covers the ones that can break without us changing
// anything, like a moved GitHub page.
//
// Run by .github/workflows/links.yml every week; you can also run it yourself:
//   npm run check-links   (npm.cmd run check-links in Windows PowerShell)
//
// Prints a Markdown report. Exits with code 1 if any link is broken, which makes
// the workflow open an alert issue.

import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

// Every page of the site (keep in sync with vite.config.ts).
const pages = ["index.html", "projects/ragdoll-fling/index.html", "404.html"];

// url -> the pages it appears on
const links = new Map();
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const [, url] of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    // Page metadata like the canonical address isn't a link people click.
    if (url.startsWith("https://jeffreydoughty.com/") && html.includes(`rel="canonical" href="${url}"`)) continue;
    links.set(url, [...new Set([...(links.get(url) ?? []), page])]);
  }
}

async function visit(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "Mozilla/5.0 (portfolio-site link check)" },
    });
    // 429 = "too many requests": the site is up but busy, so don't call it broken.
    const ok = res.status < 400 || res.status === 429;
    return { url, ok, detail: `${res.status}${res.redirected ? ` (redirected to ${res.url})` : ""}` };
  } catch (err) {
    return { url, ok: false, detail: `no answer (${err.name}: ${err.message})` };
  }
}

const results = await Promise.all([...links.keys()].map(visit));
const broken = results.filter((r) => !r.ok);

const report = [
  broken.length ? `### ❌ ${broken.length} of ${results.length} outside links are broken` : `### ✅ All ${results.length} outside links work`,
  "",
  `Checked at ${new Date().toISOString()}`,
  "",
  "| Link | Result | Found on |",
  "| --- | --- | --- |",
  ...results.map((r) => `| ${r.ok ? "✅" : "❌"} ${r.url} | ${r.detail} | ${links.get(r.url).join(", ")} |`),
  "",
].join("\n");

console.log(report);
writeFileSync("links-report.md", report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

process.exitCode = broken.length ? 1 : 0;

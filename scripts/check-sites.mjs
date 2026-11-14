// Uptime check: visits each live address and checks it answers the way it should.
// Run by .github/workflows/uptime.yml every hour; you can also run it yourself:
//   npm run check-sites   (npm.cmd run check-sites in Windows PowerShell)
//
// Prints a Markdown report. Exits with code 1 if any check fails, which makes
// the workflow open an alert issue.

import { appendFileSync, writeFileSync } from "node:fs";

const checks = [
  { name: "Portfolio home", url: "https://jeffreydoughty.com/", status: 200, contains: "Jeffrey Doughty" },
  { name: "www redirect", url: "https://www.jeffreydoughty.com/", status: 301, redirectsTo: "https://jeffreydoughty.com/" },
  { name: "Ragdoll Fling case study", url: "https://jeffreydoughty.com/projects/ragdoll-fling/", status: 200, contains: "How I built Ragdoll Fling" },
  { name: "Ragdoll Fling game", url: "https://fling.jeffreydoughty.com/", status: 200, contains: "Ragdoll Fling" },
  { name: "Leaderboard API", url: "https://fling.jeffreydoughty.com/api/leaderboard", status: 200, json: true },
];

// Fault drill: `FAULT_DRILL=1` adds a check that is meant to fail, to prove alerts work.
if (process.env.FAULT_DRILL === "1") {
  checks.push({ name: "Fault drill (meant to fail)", url: "https://jeffreydoughty.com/fault-drill-page-that-does-not-exist", status: 200 });
}

async function run(check) {
  const started = Date.now();
  try {
    const res = await fetch(check.url, {
      redirect: "manual", // report redirects instead of following them
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "portfolio-site uptime check" },
    });
    const ms = Date.now() - started;
    const problems = [];
    if (res.status !== check.status) problems.push(`expected status ${check.status}, got ${res.status}`);
    if (check.redirectsTo && res.headers.get("location") !== check.redirectsTo) {
      problems.push(`expected redirect to ${check.redirectsTo}, got ${res.headers.get("location")}`);
    }
    if (check.contains || check.json) {
      const body = await res.text();
      if (check.contains && !body.includes(check.contains)) problems.push(`page doesn't contain "${check.contains}"`);
      if (check.json) {
        try {
          JSON.parse(body);
        } catch {
          problems.push("response isn't valid JSON");
        }
      }
    }
    return { ...check, ok: problems.length === 0, detail: problems.join("; ") || `${res.status} OK`, ms };
  } catch (err) {
    return { ...check, ok: false, detail: `no answer (${err.name}: ${err.message})`, ms: Date.now() - started };
  }
}

const results = await Promise.all(checks.map(run));
const failed = results.filter((r) => !r.ok);

const report = [
  failed.length ? `### ❌ ${failed.length} of ${results.length} checks failed` : `### ✅ All ${results.length} checks passed`,
  "",
  `Checked at ${new Date().toISOString()}`,
  "",
  "| Check | Address | Result | Time |",
  "| --- | --- | --- | --- |",
  ...results.map((r) => `| ${r.ok ? "✅" : "❌"} ${r.name} | ${r.url} | ${r.detail} | ${r.ms} ms |`),
  "",
].join("\n");

console.log(report);
writeFileSync("uptime-report.md", report);
// Also show the report on the workflow run's summary page in GitHub.
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

process.exitCode = failed.length ? 1 : 0;

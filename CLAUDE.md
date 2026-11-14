# Project: Portfolio site (jeffreydoughty.com)

The owner's main portfolio website, at the apex domain https://jeffreydoughty.com.
A separate project from the Ragdoll Fling game (`C:\Users\Owner\Desktop\Video Game`), whose CLAUDE.md is the reference for proven conventions and quirks.

## About the owner and how to work with them

- New to building software. The real goal is learning to direct Claude to build and ship software the way real teams do (Git, GitHub pull requests, CI/CD, Cloudflare deploys, DNS), and to be able to explain all of it in a job interview.
- Explain things in plain language. Before running any command, say in one line what it does.
- Work in small steps. Show the result before moving on.
- Never decide silently: give options with a recommendation, and let the owner choose.
- Ask before installing anything, deleting anything, or changing settings outside the project.
- At the end of each phase, give a short recap: what we built, the key concept in one paragraph, how the owner can verify it themselves, and an example prompt they could reuse on a future project.
- Occasional quizzes to check understanding, multiple choice preferred.
- The owner handles ALL logins, passwords, and API tokens. Never ask for secrets to be pasted into chat. Say what to create and where to put it.
- Everything stays on free tiers.
- The owner reads and merges PRs themselves.

## Site design (approved 2026-11-14)

- **Purpose:** job hunting. The audience is recruiters and hiring managers who skim in seconds: who the owner is, what they've shipped, how to reach them.
- **Layout:** one scrolling page with a sticky nav bar that jumps to each section. (Separate pages can come later if the site grows.)
- **Sections:**
  1. **Home / About:** name, a short intro, the kind of work wanted. Target role is not decided yet, so keep the headline general and easy to change. No photo for now.
  2. **Projects:** project cards. **Ragdoll Fling is the first and featured project:**
     - Play it: https://fling.jeffreydoughty.com
     - Code: https://github.com/hollewood32-gif/ragdoll-fling
     - Describe the tech (TypeScript, Vite, Matter.js physics, HTML Canvas), the CI/CD pipeline (PR checks and preview links, auto-deploy to staging, production after manual approval, all on Cloudflare Workers with config in the repo), and the online leaderboard (Worker API + Cloudflare D1 database, migrations run by the pipeline, validation and rate limiting).
  3. **Resume:** shown on the page as HTML (fast to skim, searchable) plus a "Download PDF" button. The owner has a resume file to supply.
  4. **Contact:** an email link plus GitHub (https://github.com/hollewood32-gif) and LinkedIn links. The owner doesn't have a LinkedIn profile ready yet, so leave that link out until they do.
- **Look and feel:** clean and minimal. Lots of white space, one accent color, readable type, fast to load. Should look good on phones too.

### Open content questions (ask when building the sections)

- Which email address to show publicly. Options: the owner's personal address, or a free Cloudflare Email Routing address on the domain (e.g. hello@jeffreydoughty.com) that forwards to their inbox, which the owner would set up in the dashboard. Don't put any email on the site until the owner picks.
- The resume file (where it is, and which parts to show on the page).
- A short bio and the headline wording.
- The accent color.

## Tech stack (chosen 2026-11-14)

- Vite + plain HTML, CSS and TypeScript. The same tools as the game, so the pipeline can be copied almost unchanged. Chosen over Astro (new concepts to learn) and hand-written HTML with no build (CI would have little to check).
- Oxlint for lint (typescript-eslint doesn't support TypeScript 7 yet), `tsc` for type-checking, Vitest for tests.
- Hosting: Cloudflare Workers static assets, like the game. Production on the apex domain https://jeffreydoughty.com, staging on https://staging.jeffreydoughty.com (to confirm in the pipeline phase). All Cloudflare configuration lives in the repo (`wrangler.jsonc`), not in dashboard settings.
- Before claiming the apex domain, check that jeffreydoughty.com has no existing DNS records or Worker routes that would conflict. The game already uses the subdomains `fling` and `fling-staging`.
- Public GitHub repo: https://github.com/hollewood32-gif/portfolio-site. `main` is protected. Every change goes through a pull request.

## Domain and accounts

- Domain: jeffreydoughty.com, DNS on Cloudflare. Cloudflare account id `1fffec26e09010f5be9bf9332b2b8e03`.
- This repo needs its own GitHub secret `CLOUDFLARE_API_TOKEN` (the game's secret belongs to the game repo only). The owner creates the token and the secret themselves.

## Phase plan and status

1. [x] Design interview, saved here. (2026-11-14)
2. [x] Stack chosen: Vite + HTML/CSS/TS. (2026-11-14)
3. [x] Repo: create the folder and public GitHub repo, protect `main`, first PR (the Vite skeleton). (Done 2026-11-14. The "Protect main" ruleset requires a PR, blocks force pushes and deletion; the required `checks` status check gets added in phase 4 once that job exists.)
4. [x] Pipeline and hosting (PR #2, 2026-11-14): reuse the game's setup.
   - Workers `portfolio` (production: jeffreydoughty.com + www.jeffreydoughty.com, workers.dev backup https://portfolio.ragdoll-fling.workers.dev) and `portfolio-staging` (https://staging.jeffreydoughty.com, PR previews `https://pr-<number>-portfolio-staging.ragdoll-fling.workers.dev`).
   - `worker/index.ts` runs first on every request (`run_worker_first: true`): any `www.` host gets a 301 to the same path without `www.`; everything else is served from `dist/` via the `ASSETS` binding.
   - Before claiming the apex, checked on 2026-11-14: jeffreydoughty.com had no A/AAAA/MX/TXT records, and the only Workers were the game's (`fling.`, `fling-staging.`). Note there are no MX records, so no email on the domain yet.
   - Staging was deployed once by hand from this computer (`npx wrangler deploy --env staging`) to prove the config. Production only deploys through the pipeline.
   - GitHub environments `staging` (no gate) and `production` (required reviewer hollewood32-gif, protected branches only), created with `gh api`. Repo secret `CLOUDFLARE_API_TOKEN` was created by the owner. The "Protect main" ruleset requires the `checks` status check.
   - Original plan for reference: PR `checks` job (lint, typecheck, test, build) plus a preview link; merging to `main` deploys to staging automatically; production waits for the owner's approval (GitHub environments `staging` and `production`, required reviewer hollewood32-gif, plus an `npm run approve` script like the game's). Apex domain for production, `staging.` subdomain for staging.
5. [ ] Content PRs: Home/About, Projects (Ragdoll Fling first), Resume (HTML + PDF), Contact.
6. [ ] Polish: favicon, link preview card, accessibility and phone checks.

## Notes for future sessions

- Read this file first. Check the status checkboxes above to see where we left off, and update them as phases finish.
- Keep each PR small and reviewable so the owner can explain every change.
- Machine: Windows 11, PowerShell 5.1. Tools installed with winget: Git, Node.js 26, GitHub CLI. Reload PATH at the start of each command: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`.
- The owner's own PowerShell blocks scripts (default execution policy), so `npx`/`npm` resolve to blocked `.ps1` files. Tell the owner to use `npx.cmd` / `npm.cmd`. Don't change the execution policy.
- Git workflow: every change, including CLAUDE.md updates, goes on a branch, then a PR. After a merge: `git switch main`, `git pull`, `git branch -d <branch>`.
- PowerShell 5.1 quirks: piping a here-string into `git commit -F -` adds an invisible BOM to the message, so use several `-m` flags instead. Avoid `--jq` filters that contain `"` or `\(`.
- Use `curl.exe` for URL checks (`Invoke-WebRequest` needs TLS 1.2 set up first).
- Wrangler is logged in as the owner via OAuth on this machine (`npx wrangler whoami` to check); CI will use an API token. The GitHub CLI is logged in over HTTPS.
- Always pass `--env staging` or `--env=""` to Wrangler once environments exist.
- GitHub's merge and approve buttons are two-step (Merge → Confirm merge; Review deployments → tick the box → Approve), and the approve button often didn't register for the owner, which is why the game has `npm run approve`. Verify with `gh pr view N --json state` before continuing, and don't approve production deploys for the owner.
- `.claude/` is gitignored (local launch config with this machine's paths). `.gitattributes` forces LF line endings.

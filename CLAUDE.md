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
- **Look and feel:** clean and minimal, readable type, fast to load, good on phones. **Dark by default with light blue buttons and links** (changed from a white page on 2026-11-14 at the owner's request). Visitors whose device is set to light mode get a white version with a darker blue, via `@media (prefers-color-scheme: light)`. All colors are CSS variables at the top of `src/style.css`.
- **Headline (chosen 2026-11-14):** "I build and ship web software, from first commit to production."
- **Bio:** drafted from the owner's resume (`C:\Users\Owner\Downloads\JD RESUME - Google Docs.pdf`, Feb 2026): U.S. Navy nuclear equipment technician (2018–2020), electrical technician (Intercoast College, 2022), cyber security specialist (2023), now building web software. Never publish the resume's phone number or street address.

### Open content questions (ask when building the sections)

- Which parts of the resume to show on the page and in the downloadable PDF (the current resume is aimed at trades and grocery work, and lists the phone number and email).
- Nav links get added as each section lands, so the nav never points at a missing section (`src/page.test.ts` checks this).

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
5. [x] Content PRs: Home/About, Projects (Ragdoll Fling first), Resume (HTML + PDF), Contact. (Done 2026-11-14, all live.)
   - [x] PR #3: Home/About and the dark design.
   - [x] PR #4: Projects (Ragdoll Fling featured, plus "This website"). On phones (under 34rem) the nav hides the name and keeps only the links.
   - [x] PR #5: Resume. Software-first rewrite of the owner's resume (approved 2026-11-14), location shown as "Orange County, CA" only. The text lives in `src/resume-data.ts`; a plugin in `vite.config.ts` builds both the page section (replacing `<!-- resume:content -->` in index.html) and `Jeffrey-Doughty-Resume.pdf` (pdf-lib, layout in `src/resume-pdf.ts`). A test fails if a phone number ever appears in the resume data. The Cyber Security Specialist program's school isn't on the original resume; ask the owner if they want it added.
   - [x] PR #6: Contact. Public address **jeff@jeffreydoughty.com** (chosen 2026-11-14), forwarded to the owner's personal inbox by Cloudflare Email Routing, which the owner set up in the dashboard. Email Routing isn't something Wrangler manages, so it's the one piece of config outside the repo (its MX and SPF records show in the zone's DNS). The page never contains the whole address: `src/contact.ts` joins `data-user` and `data-domain` in the browser, and `src/contact.test.ts` fails if a full address appears in index.html. The resume PDF does show it in plain text (unavoidable for a resume). GitHub moved from the nav into Contact.
6. [x] Polish (PR #7, 2026-11-14): "JD" monogram favicon (`public/favicon.svg`, letters drawn as paths), iPhone icon and link preview card. The PNGs (`public/apple-touch-icon.png`, `public/og-image.png`, card design in `art/og-image.svg`) are made by `npm run images` (`scripts/make-images.mjs`, using @resvg/resvg-js with this computer's fonts) and committed; rerun it after changing the artwork or the headline. Accessibility pass: every text color passes WCAG AA contrast (4.5:1) in both color schemes, one h1 and no skipped heading levels, all links named, skip link first in tab order, `lang="en"`, reduced-motion respected.

7. [ ] Extras (suggested 2026-11-14, owner picked 1 and 2 first):
   - [x] PR #8: Ragdoll Fling case study page at `/projects/ragdoll-fling/` (pipeline diagram, five problems solved, takeaways) and a real game screenshot (`public/ragdoll-fling.webp`) on the project card and the case study. The site is now multi-page: each page is listed in `vite.config.ts` (`build.rollupOptions.input`) and in `src/page.test.ts` (`pages`). The page tests check every internal link and image points to a real page, section or file.
   - [x] PR #9: operations.
     - Dependabot (`.github/dependabot.yml`): weekly npm and GitHub Actions updates, small updates grouped into one PR. Dependabot PRs can't read repo secrets, so `ci.yml` skips the preview job for them; the required `checks` job still runs.
     - Uptime check (`.github/workflows/uptime.yml` + `scripts/check-sites.mjs`, also `npm run check-sites`): hourly at :17, checks the portfolio home, the www redirect, the case study, the game and the leaderboard API. A failure opens one issue labelled `site-down` (or comments on the open one); the next passing run closes it. "Run workflow" with **fault drill** adds a check that's meant to fail, to test alerts. GitHub disables scheduled workflows in a public repo after 60 days without commits; re-enable from the Actions tab if that happens.
   - [x] PR #11: custom 404 page (`404.html`; headline changed in PR #12 to the owner's wording "Sorry about that, something went wrong."). `wrangler.jsonc` sets `assets.not_found_handling: "404-page"`, so any missing address gets it with a real 404 status, including through the Worker's `env.ASSETS.fetch`. It's `noindex`, and a test makes sure it only uses root-relative links (it's served at any depth). PR #13 added an uptime check that a made-up address returns 404 with the page; it matches the `<title>Page not found`, so headline rewording doesn't break it.
   - [x] PR #14: Cloudflare Web Analytics. The Web Analytics site for jeffreydoughty.com was created in the dashboard on 2026-11-14 (Claude clicked through with the owner's OK) and set to **"Enable with JS Snippet installation"**, so Cloudflare doesn't inject anything itself; the code is in the repo. `src/analytics.ts` holds the public site token and loads the beacon only when the hostname is exactly `jeffreydoughty.com` (staging, previews and localhost don't count). The Web Analytics site setting itself lives in the dashboard (Analytics & Logs → Web Analytics → Manage site).
   - [x] PR #15: accessibility and link checks.
     - `src/a11y.test.ts`: axe-core (WCAG 2.2 A/AA + best practice) runs on every page in jsdom, with the home page's resume section filled in. jsdom can't render color, so axe's contrast rule is off there.
     - `src/contrast.test.ts`: reads the color variables from `style.css` (dark, plus the light-mode overrides) and checks every text/background pair is at least 4.5 : 1. Needs `test.css.include` in `vite.config.ts`, because Vitest hands tests an empty string for CSS otherwise. Add new pairs to its `pairs` list when adding colors.
     - Links inside the site are checked on every PR by `src/page.test.ts`. Outside links: `.github/workflows/links.yml` + `scripts/check-links.mjs` (also `npm run check-links`), Mondays 15:23 UTC, opens/closes an issue labelled `broken-link` like the uptime check. Owner chose weekly over per-PR so other sites' outages can't block merges.
     - Proven by planting a missing alt text (axe: image-alt) and a pale grey (1.87 : 1); both failed, then were reverted.
   - [ ] LinkedIn link once the owner has a profile.
   - [ ] Maybe: add `.ts` extensions to the imports in `vite.config.ts` to silence Vite's future "configLoader: native" warning.
   - Screenshot method (to redo it): open the live game in the browser pane at 1200x675 with the pane visible (the game pauses when hidden), throw with smooth synthetic pointer events from the page, save canvas frames with `canvas.toDataURL()` every 60 ms, pick one, convert to WebP, then decode it into `public/` and compare SHA-256 hashes.

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
- `npm.cmd run approve` must be run from the `portfolio-site` folder (each project's script only approves its own repo). Since PR #16 it waits for a deploy that's still building or on staging (up to 6 minutes) instead of saying "nothing is waiting", so the owner can run it straight after merging. The game's copy of the script doesn't wait yet. Don't run it yourself while a deploy is waiting: that would approve production for the owner.
- The local dev server (`.claude/launch.json`, port 5174) must be restarted after changing `vite.config.ts` or `tsconfig.json`: once it reloaded itself after a tsconfig change and stopped running the resume plugin (the page showed the raw `<!-- resume:content -->` marker). Builds and deploys were never affected.
- `.claude/` is gitignored (local launch config with this machine's paths). `.gitattributes` forces LF line endings.

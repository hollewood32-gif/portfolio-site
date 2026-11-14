// Vite settings:
// 1. The site has more than one page, so the build lists each page's HTML file.
// 2. A small plugin builds the resume:
//   - Puts the resume HTML into index.html where it says <!-- resume:content -->
//   - Writes Jeffrey-Doughty-Resume.pdf into the build output (dist/)
//   - Serves the same PDF from the dev server, so the link works locally too
// 3. Test settings (Vitest reads this file too).
/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import { resume } from "./src/resume-data";
import { resumeHtml } from "./src/resume-html";
import { resumePdf } from "./src/resume-pdf";

const PDF_NAME = "Jeffrey-Doughty-Resume.pdf";

function resumePlugin(): Plugin {
  return {
    name: "resume",
    transformIndexHtml(html, ctx) {
      const isHomePage = ctx.path === "/index.html" || ctx.path === "/";
      if (isHomePage && !html.includes("<!-- resume:content -->")) {
        throw new Error("index.html is missing the <!-- resume:content --> marker");
      }
      return html.replace("<!-- resume:content -->", resumeHtml(resume));
    },
    async generateBundle() {
      this.emitFile({ type: "asset", fileName: PDF_NAME, source: await resumePdf(resume) });
    },
    configureServer(server) {
      server.middlewares.use(`/${PDF_NAME}`, async (_req, res) => {
        res.setHeader("Content-Type", "application/pdf");
        res.end(await resumePdf(resume));
      });
    },
  };
}

export default defineConfig({
  plugins: [resumePlugin()],
  build: {
    rollupOptions: {
      // Every page of the site (paths from the project folder). Add new pages here.
      input: {
        home: "index.html",
        ragdollFling: "projects/ragdoll-fling/index.html",
        notFound: "404.html",
      },
    },
  },
  test: {
    // Vitest skips CSS files unless told otherwise. contrast.test.ts needs the
    // real text of style.css to check its colors.
    css: { include: [/style\.css/] },
  },
});

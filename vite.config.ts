// Vite settings. The one addition: a small plugin that builds the resume.
//   - Puts the resume HTML into index.html where it says <!-- resume:content -->
//   - Writes Jeffrey-Doughty-Resume.pdf into the build output (dist/)
//   - Serves the same PDF from the dev server, so the link works locally too
import { defineConfig, type Plugin } from "vite";
import { resume } from "./src/resume-data";
import { resumeHtml } from "./src/resume-html";
import { resumePdf } from "./src/resume-pdf";

const PDF_NAME = "Jeffrey-Doughty-Resume.pdf";

function resumePlugin(): Plugin {
  return {
    name: "resume",
    transformIndexHtml(html) {
      if (!html.includes("<!-- resume:content -->")) {
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
});

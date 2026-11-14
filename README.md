# portfolio-site

The source for [jeffreydoughty.com](https://jeffreydoughty.com), Jeffrey Doughty's portfolio site.

Built with [Vite](https://vite.dev) and plain HTML, CSS and TypeScript. It will be hosted on Cloudflare Workers, with every change going through a pull request and a CI/CD pipeline.

## Run it on your computer

Needs [Node.js](https://nodejs.org) 26.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Checks

| Command | What it does |
| --- | --- |
| `npm run lint` | Looks for likely bugs (Oxlint) |
| `npm run typecheck` | Checks the TypeScript types |
| `npm test` | Runs the tests (Vitest) |
| `npm run build` | Builds the finished site into `dist/` |

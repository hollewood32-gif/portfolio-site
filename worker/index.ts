// The site's tiny bit of server code. It runs on Cloudflare before each request:
//   - www.jeffreydoughty.com/... gets a permanent redirect to jeffreydoughty.com/...
//   - everything else is served straight from the built site files (dist/).
import { wwwRedirect } from "./redirect";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const target = wwwRedirect(request.url);
    if (target) {
      // 301 = "moved permanently", so browsers and search engines remember it.
      return Response.redirect(target, 301);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

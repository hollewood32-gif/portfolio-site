// Cloudflare Web Analytics: privacy-friendly visit counts (no cookies, no
// personal data, so no consent banner needed). The dashboard is in Cloudflare
// under Analytics & Logs -> Web Analytics -> jeffreydoughty.com.
//
// The token identifies the site, not a person, and is public by design: it
// ends up in every visitor's page. It came from the site's "Manage site" page
// (set to "Enable with JS Snippet installation").
export const ANALYTICS_TOKEN = "e862062ae3da45c2b93de7425cab6189";
export const BEACON_URL = "https://static.cloudflareinsights.com/beacon.min.js";

// Only count visits on the real site, so staging, PR previews and local
// testing don't add fake visits.
export const PRODUCTION_HOST = "jeffreydoughty.com";

export function shouldTrack(hostname: string): boolean {
  return hostname === PRODUCTION_HOST;
}

// Adds Cloudflare's script to the page (same as the dashboard's snippet).
export function loadAnalytics(doc: Document): void {
  if (!shouldTrack(doc.location.hostname)) return;
  const script = doc.createElement("script");
  script.defer = true;
  script.src = BEACON_URL;
  script.setAttribute("data-cf-beacon", JSON.stringify({ token: ANALYTICS_TOKEN }));
  doc.body.appendChild(script);
}

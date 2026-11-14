// Decides whether a request should be redirected away from "www.".
// www.jeffreydoughty.com/any/path?x=1  ->  https://jeffreydoughty.com/any/path?x=1
// Returns the new address, or null when no redirect is needed.
export function wwwRedirect(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  if (!url.hostname.startsWith("www.")) return null;
  url.hostname = url.hostname.slice("www.".length);
  url.protocol = "https:";
  return url.toString();
}

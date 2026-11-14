// Light spam protection: the email address is never written whole in the page.
// The HTML holds the two halves in data-user and data-domain attributes, and
// this code joins them when a real browser shows the page. Most simple spam
// bots read the raw HTML looking for "name@domain", so they never see it.

export function emailAddress(user: string, domain: string): string {
  return `${user}@${domain}`;
}

// Turns every <a data-user="..." data-domain="..."> into a working email link.
export function revealEmailLinks(root: ParentNode): void {
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-user][data-domain]")) {
    const address = emailAddress(link.dataset.user ?? "", link.dataset.domain ?? "");
    link.href = `mailto:${address}`;
    const label = link.querySelector("[data-email-text]");
    if (label) label.textContent = address;
  }
}

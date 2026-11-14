import { revealEmailLinks } from "./contact";
import { footerText } from "./footer";

// Fill in the footer with the current year, so it never goes out of date.
const footer = document.getElementById("footer");
if (footer) {
  footer.textContent = footerText(new Date().getFullYear());
}

// Put together the email links (see contact.ts for why).
revealEmailLinks(document);

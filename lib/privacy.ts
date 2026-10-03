import fs from "node:fs";
import path from "node:path";

// The privacy policy is plain HTML (headings, paragraphs, lists, links) in
// content/privacy.html, so it can be edited without touching code. Read at
// build time: the page and the sitemap are static.
export function readPrivacyHtml(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), "content", "privacy.html"), "utf8");
  } catch {
    return "";
  }
}

// True when the file holds real text, not just comments or empty tags.
export function hasPolicyText(html: string): boolean {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").trim().length > 0;
}

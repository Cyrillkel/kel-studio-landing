import fs from "node:fs";
import path from "node:path";
import { SITE_URL } from "./site";

// When the current text of the policy was published. Set by hand, with the text.
export const POLICY_UPDATED = "2026-10-03";

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

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&laquo;": "«",
  "&raquo;": "»",
  "&ndash;": "-",
  "&mdash;": "-",
};

// Text of a piece of HTML, for the table of contents.
const plain = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    .replace(/\s+/g, " ")
    .trim();

// A link keeps its address only if it is an ordinary one.
const SAFE_LINK = /^(https?:|mailto:|tel:|\/|#)/i;

// id and class survive, in plain form: the policy's own markup (clause numbers,
// definition lists) uses them. Inline styles and everything else do not.
const keepAttr = (attrs: string, name: "id" | "class") => {
  const found = attrs.match(new RegExp(`\\s${name}\\s*=\\s*"([A-Za-z0-9_ -]+)"`, "i"));
  return found ? ` ${name}="${found[1]}"` : "";
};

// Policy generators and word processors export a lot of baggage: whole
// documents, styles, classes, fonts, spans. Keep what carries meaning:
// headings, paragraphs, lists, emphasis, tables, links. The look comes from the
// page's own styles.
export function cleanPolicyHtml(raw: string): string {
  let html = raw;
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (body) html = body[1];

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|head|title|noscript)\b[\s\S]*?<\/\1>/gi, "")
    // The page has its own h1.
    .replace(/<h1\b[\s\S]*?<\/h1>/gi, "")
    .replace(/<\/?(font|center|o:p)\b[^>]*>/gi, "")
    .replace(/<b\b[^>]*>/gi, "<strong>")
    .replace(/<\/b>/gi, "</strong>")
    .replace(/<i\b[^>]*>/gi, "<em>")
    .replace(/<\/i>/gi, "</em>")
    // Attributes go, except id, class and the address of a link.
    .replace(/<([a-z][a-z0-9]*)((?:\s[^>]*)?)>/gi, (_match, tag: string, attrs: string) => {
      const name = tag.toLowerCase();
      if (name !== "a") return `<${name}${keepAttr(attrs, "id")}${keepAttr(attrs, "class")}>`;
      const href = attrs.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const url = href?.[1] ?? href?.[2] ?? "";
      if (!SAFE_LINK.test(url)) return "<a>";
      // Links to our own site open in the same tab.
      const outside = /^https?:/i.test(url) && !url.startsWith(SITE_URL);
      return `<a href="${url}"${outside ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
    })
    .trim();
}

export type PolicySection = { id: string; title: string; titleHtml: string; html: string };

// Cuts the text into sections at every h2: the lead-in before the first one,
// then one section per heading, with a stable id for the table of contents.
export function splitPolicy(html: string): { intro: string; sections: PolicySection[] } {
  const parts = html.split(/(?=<h2\b)/i);
  const intro = /^<h2\b/i.test(parts[0] ?? "") ? "" : (parts.shift() ?? "");
  const sections = parts.map((chunk, index) => {
    const heading = chunk.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const titleHtml = heading?.[1] ?? "";
    return {
      id: `section-${index + 1}`,
      title: plain(titleHtml),
      titleHtml,
      html: chunk.slice(heading?.[0].length ?? 0).trim(),
    };
  });
  return { intro: intro.trim(), sections };
}

// "2026-10-03" -> "3 октября 2026".
export function formatPolicyDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

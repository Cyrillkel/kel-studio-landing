import Link from "next/link";
import type { ReactNode } from "react";

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

// Page text can carry internal links written as [label](/path), so the copy
// stays plain strings in the locale files. Search engines get the label only
// in the structured data (see plainText in lib/services.ts).
export default function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      <Link
        key={index}
        href={match[2]}
        className="text-violet-300 underline decoration-violet-300/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
      >
        {match[1]}
      </Link>
    );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

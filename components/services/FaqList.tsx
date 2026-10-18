"use client";

import RichText from "@/components/RichText";

type FaqItem = { q: string; a: string };

// The questions at the bottom of the service pages and the prices page.
// The padding sits inside the <summary>, so the whole row of a question opens
// it, not only its text. A click on an open answer closes it again, unless it
// lands on a link in the answer or ends a text selection.
export default function FaqList({ items }: { items: FaqItem[] }) {
  const closeOnClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as Element).closest("a")) return;
    if (window.getSelection()?.toString()) return;
    const details = e.currentTarget.closest("details");
    if (details) details.open = false;
  };

  return (
    <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/3">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-heading text-base font-bold text-white sm:px-6 sm:text-lg [&::-webkit-details-marker]:hidden">
            {item.q}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <p
            onClick={closeOnClick}
            className="-mt-2 cursor-pointer px-5 pb-5 leading-relaxed text-gray-300 sm:px-6"
          >
            <RichText text={item.a} />
          </p>
        </details>
      ))}
    </div>
  );
}

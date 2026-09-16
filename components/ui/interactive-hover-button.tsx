// Adapted from Magic UI Interactive Hover Button (https://magicui.design, MIT):
// link variant, site colours, inline arrow instead of lucide-react.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function ArrowRight() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function InteractiveHoverLink({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "children"
>) {
  return (
    <a
      {...props}
      className={cn(
        "group relative inline-block w-auto cursor-pointer overflow-hidden rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-center font-semibold text-white transition-[border-color,translate] duration-300 hover:border-transparent active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400",
        className
      )}
    >
      <span className="flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 whitespace-nowrap text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100"
      >
        <span>{children}</span>
        <ArrowRight />
      </span>
    </a>
  );
}

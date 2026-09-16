// Adapted from Magic UI Shimmer Button (https://magicui.design, MIT):
// renders a link or a button, colours tuned for the site.
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShimmerOptions = {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  className?: string;
  children?: ReactNode;
};

const shimmerStyle = ({
  shimmerColor = "#a78bfa",
  shimmerSize = "0.1em",
  shimmerDuration = "3s",
  borderRadius = "0.75rem",
  background = "#ffffff",
}: ShimmerOptions) =>
  ({
    "--spread": "90deg",
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
  }) as CSSProperties;

const shimmerClass = (className?: string) =>
  cn(
    "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap font-semibold text-black [background:var(--bg)]",
    "transform-gpu transition-[translate,box-shadow] duration-300 ease-in-out active:translate-y-px",
    "hover:shadow-[0_10px_30px_-8px_rgba(168,85,247,0.6),0_6px_18px_-8px_rgba(34,211,238,0.5)]",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400",
    className
  );

function ShimmerLayers({ children }: { children?: ReactNode }) {
  return (
    <>
      <div className="@container-[size] absolute inset-0 -z-30 overflow-visible blur-[2px]">
        <div className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      <span className="relative">{children}</span>
      <div className="absolute inset-0 size-full [border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
      <div className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </>
  );
}

export function ShimmerButton({
  shimmerColor,
  shimmerSize,
  shimmerDuration,
  borderRadius,
  background,
  className,
  children,
  style,
  type = "button",
  ...props
}: ShimmerOptions &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button
      {...props}
      type={type}
      style={{
        ...shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background }),
        ...style,
      }}
      className={shimmerClass(className)}
    >
      <ShimmerLayers>{children}</ShimmerLayers>
    </button>
  );
}

export function ShimmerLink({
  shimmerColor,
  shimmerSize,
  shimmerDuration,
  borderRadius,
  background,
  className,
  children,
  style,
  ...props
}: ShimmerOptions &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">) {
  return (
    <a
      {...props}
      style={{
        ...shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background }),
        ...style,
      }}
      className={shimmerClass(className)}
    >
      <ShimmerLayers>{children}</ShimmerLayers>
    </a>
  );
}

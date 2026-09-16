import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ShimmerButton, ShimmerLink } from "./ui/shimmer-button";
import { InteractiveHoverLink } from "./ui/interactive-hover-button";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2 text-[15px]",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

type LinkProps = {
  variant?: "primary" | "outline";
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkProps) {
  const classes = cn(SIZES[size], className);
  return variant === "outline" ? (
    <InteractiveHoverLink {...props} className={classes} />
  ) : (
    <ShimmerLink {...props} className={classes} />
  );
}

export function Button({
  size = "md",
  className,
  ...props
}: {
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return <ShimmerButton {...props} className={cn(SIZES[size], className)} />;
}

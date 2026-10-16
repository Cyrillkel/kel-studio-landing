import { homeOgImage } from "@/lib/og";

// The card for the English pages (the Russian one is app/(ru)/opengraph-image/route.tsx).
export const dynamic = "force-static";

export function GET() {
  return homeOgImage("en");
}

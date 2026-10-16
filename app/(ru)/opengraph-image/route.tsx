import { homeOgImage } from "@/lib/og";

// Card shown when the link is posted in Telegram, WhatsApp, social networks.
// A plain route handler, not the opengraph-image file convention: that one gets a
// hash added to its address once it sits in a route group, and this address is in
// the markup of the pages and is already known to the messengers.
export const dynamic = "force-static";

export function GET() {
  return homeOgImage("ru");
}

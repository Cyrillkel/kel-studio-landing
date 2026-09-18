import type { NextConfig } from "next";
import { INDEXABLE } from "./lib/site";

const nextConfig: NextConfig = {
  async headers() {
    if (INDEXABLE) return [];
    // Belt and braces next to the robots meta tag: the header also covers
    // files with no HTML of their own, like images and the video.
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

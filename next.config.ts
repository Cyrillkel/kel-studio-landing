import path from "node:path";
import type { NextConfig } from "next";
import { INDEXABLE } from "./lib/site";

const nextConfig: NextConfig = {
  // Deploys ship .next/standalone: server.js plus only the node_modules it
  // needs, so the server never installs dependencies. See .github/workflows/deploy.yml.
  output: "standalone",
  // Without this Next walks up to ~/web and nests the standalone output in
  // web/kel-studio/kel-studio-landing/.
  outputFileTracingRoot: path.resolve(__dirname),
  // Nobody needs to know which framework is behind the site.
  poweredByHeader: false,
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

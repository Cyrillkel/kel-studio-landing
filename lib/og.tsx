import { ImageResponse } from "next/og";
import { CATEGORIES, type Post } from "./blog";
import { getDictionary } from "./dictionary";
import { LOGO_DARK, LOGO_KEL, LOGO_MARK, LOGO_STUDIO, LOGO_VIEWBOX } from "./brand";
import type { Lang } from "./lang";

// The cards shown when a link is posted in Telegram, WhatsApp, social networks
// (the opengraph-image files of both languages call these; the files themselves
// declare the size as a literal, which Next reads without running them).
const OG_SIZE = { width: 1200, height: 630 };

// The logo (lib/brand.ts) in the dark theme's colours, at the given height.
const LOGO_ASPECT = Number(LOGO_VIEWBOX.split(" ")[2]) / Number(LOGO_VIEWBOX.split(" ")[3]);
function Logo({ height }: { height: number }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} width={Math.round(height * LOGO_ASPECT)} height={height}>
      {LOGO_MARK.map((face) => (
        <path key={face.d} d={face.d} fill={LOGO_DARK[face.face]} />
      ))}
      <path d={LOGO_KEL} fill={LOGO_DARK.text} />
      <path d={LOGO_STUDIO} fill={LOGO_DARK.soft} />
    </svg>
  );
}

export function homeOgImage(lang: Lang) {
  const { ogTagline } = getDictionary(lang).meta;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b0f1a",
          // Same violet wash as the hero.
          backgroundImage:
            "radial-gradient(ellipse at 50% 45%, rgba(139,92,246,0.35), transparent 65%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <Logo height={132} />
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#d4d4d8",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {ogTagline}
        </div>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 220,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(to right, #22d3ee, #a78bfa, #e879f9)",
            }}
          />
        </div>
        <div style={{ marginTop: 40, fontSize: 32, color: "#a1a1aa" }}>kel.agency</div>
      </div>
    ),
    OG_SIZE
  );
}

// Card for a link to an article: the title on the site's dark background with the violet wash.
export function blogOgImage(lang: Lang, post: Post | undefined) {
  const blog = getDictionary(lang).blog;
  const title = post?.title ?? blog.ogFallbackTitle;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0f1a",
          backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.35), transparent 65%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#a78bfa" }}>
          {post ? CATEGORIES[lang][post.category] : blog.ogLabel}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 64, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo height={52} />
          <div style={{ display: "flex", width: 220, height: 4, borderRadius: 2, background: "linear-gradient(to right, #22d3ee, #a78bfa, #e879f9)" }} />
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa" }}>kel.agency/blog</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}

import { ImageResponse } from "next/og";
import { CATEGORIES, getPost, getPosts } from "@/lib/blog";

// Card for a link to the article in messengers: the title on the site's dark
// background with the violet wash.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Блог KEL Studio";
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
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.35), transparent 65%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#a78bfa" }}>
          {post ? CATEGORIES[post.category] : "Блог"}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 64, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>KEL Studio</div>
          <div style={{ display: "flex", width: 220, height: 4, borderRadius: 2, background: "linear-gradient(to right, #22d3ee, #a78bfa, #e879f9)" }} />
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa" }}>kel.agency/blog</div>
        </div>
      </div>
    ),
    size
  );
}

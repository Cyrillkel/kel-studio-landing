import { getPost, getPosts } from "@/lib/blog";
import { blogOgImage } from "@/lib/og";

// Card for a link to the article in messengers (see lib/og.tsx and the note in
// app/(ru)/opengraph-image/route.tsx on why this is a route handler).
export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = () => getPosts("ru").map((post) => ({ slug: post.slug }));

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug, "ru");
  if (!post) return new Response("Not found", { status: 404 });
  return blogOgImage("ru", post);
}

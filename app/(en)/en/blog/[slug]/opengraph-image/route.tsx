import { getPost, getPosts } from "@/lib/blog";
import { blogOgImage } from "@/lib/og";

// Card for a link to the English article in messengers.
export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = () => getPosts("en").map((post) => ({ slug: post.slug }));

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug, "en");
  if (!post) return new Response("Not found", { status: 404 });
  return blogOgImage("en", post);
}

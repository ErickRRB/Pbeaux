import { notFound } from "next/navigation";
import { PostDetailClient } from "./post-detail-client";
import { fetchPostBySlug } from "@/lib/db";

export const revalidate = 3600;

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post = null;
  try {
    post = await fetchPostBySlug(slug);
  } catch {
    // Supabase no disponible
  }

  if (!post || post.status !== "published") {
    notFound();
  }

  return <PostDetailClient post={post} />;
}

import { HomeClient } from "@/components/home-client";
import { fetchPublishedPosts } from "@/lib/db";
import { BlogPost } from "@/lib/content-types";

// Editorial changes made in the admin still invalidate this page on demand.
export const revalidate = 3600;

export default async function Home() {
  let posts: BlogPost[] = [];
  try {
    posts = await fetchPublishedPosts();
  } catch (err) {
    console.error("[home] fetchPublishedPosts failed:", err);
  }
  // The listing needs titles and excerpts, not every article's reading blocks.
  // Keep the existing client contract while shrinking the cached RSC payload.
  const summaries = posts.map((post) => ({
    ...post,
    translations: Object.fromEntries(
      Object.entries(post.translations).map(([locale, translation]) => [
        locale,
        translation ? { ...translation, blocks: [] } : translation,
      ]),
    ),
  }));
  return <HomeClient initialPosts={summaries} />;
}

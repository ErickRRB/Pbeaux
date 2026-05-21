import { HomeClient } from "@/components/home-client";
import { fetchPublishedPosts } from "@/lib/db";
import { BlogPost } from "@/lib/content-types";

export const revalidate = 60;

export default async function Home() {
  let posts: BlogPost[] = [];
  try {
    posts = await fetchPublishedPosts();
  } catch (err) {
    console.error("[home] fetchPublishedPosts failed:", err);
  }
  return <HomeClient initialPosts={posts} />;
}

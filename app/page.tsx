import { HomeClient } from "@/components/home-client";
import { fetchPublishedPosts } from "@/lib/db";
import { BlogPost } from "@/lib/content-types";

export const revalidate = 60;

export default async function Home() {
  let posts: BlogPost[] = [];
  try {
    posts = await fetchPublishedPosts();
  } catch {
    // Si Supabase no está disponible, muestra la home vacía
  }
  return <HomeClient initialPosts={posts} />;
}

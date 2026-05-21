import { BlogPost, ContentBlock, Locale } from "./content-types";
import { getSupabase } from "./supabase-server";

type DbPost = {
  id: string;
  slug: string;
  category: string;
  status: string;
  cover_image: string;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type DbTranslation = {
  post_id: string;
  locale: string;
  title: string;
  excerpt: string;
  seo_title: string | null;
  seo_description: string | null;
  blocks: ContentBlock[];
};

type DbPostWithTranslations = DbPost & {
  post_translations: DbTranslation[];
};

function rowToPost(row: DbPostWithTranslations): BlogPost {
  const translations: BlogPost["translations"] = {};
  for (const t of row.post_translations ?? []) {
    translations[t.locale as Locale] = {
      locale: t.locale as Locale,
      title: t.title,
      excerpt: t.excerpt,
      seoTitle: t.seo_title ?? undefined,
      seoDescription: t.seo_description ?? undefined,
      blocks: t.blocks,
    };
  }
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    status: row.status as BlogPost["status"],
    coverImage: row.cover_image,
    featured: row.featured,
    publishedAt: row.published_at ?? row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    translations,
  };
}

async function saveTranslations(postId: string, post: BlogPost): Promise<void> {
  const db = getSupabase();

  await db.from("post_translations").delete().eq("post_id", postId);

  const rows = Object.values(post.translations)
    .filter(Boolean)
    .map((t) => ({
      post_id: postId,
      locale: t!.locale,
      title: t!.title,
      excerpt: t!.excerpt,
      seo_title: t!.seoTitle ?? null,
      seo_description: t!.seoDescription ?? null,
      blocks: t!.blocks,
    }));

  if (rows.length > 0) {
    const { error } = await db.from("post_translations").insert(rows);
    if (error) throw error;
  }
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("posts")
    .select("*, post_translations(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data as DbPostWithTranslations[]).map(rowToPost);
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("posts")
    .select("*, post_translations(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbPostWithTranslations[]).map(rowToPost);
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getSupabase();
  const { data, error } = await db
    .from("posts")
    .select("*, post_translations(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return rowToPost(data as DbPostWithTranslations);
}

export async function upsertPost(post: BlogPost): Promise<void> {
  const db = getSupabase();
  const { error: postError } = await db.from("posts").upsert({
    id: post.id,
    slug: post.slug,
    category: post.category,
    status: post.status,
    cover_image: post.coverImage,
    featured: post.featured,
    published_at: post.publishedAt,
    created_at: post.createdAt,
    updated_at: new Date().toISOString(),
  });
  if (postError) throw postError;
  await saveTranslations(post.id, post);
}

export async function removePost(id: string): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) throw error;
}

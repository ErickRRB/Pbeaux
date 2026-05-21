import { BlogPost, Locale, PostTranslation } from "./content-types";
import { seedPosts } from "./seed-posts";

const STORAGE_KEY = "pbeaux.posts.v1";

export function cloneSeedPosts() {
  return structuredClone(seedPosts);
}

export function loadStoredPosts(): BlogPost[] {
  if (typeof window === "undefined") {
    return cloneSeedPosts();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    saveStoredPosts(seedPosts);
    return cloneSeedPosts();
  }

  try {
    const parsedPosts = JSON.parse(stored) as BlogPost[];

    if (!Array.isArray(parsedPosts) || parsedPosts.length === 0) {
      saveStoredPosts(seedPosts);
      return cloneSeedPosts();
    }

    return parsedPosts;
  } catch {
    saveStoredPosts(seedPosts);
    return cloneSeedPosts();
  }
}

export function saveStoredPosts(posts: BlogPost[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function resetStoredPosts() {
  saveStoredPosts(seedPosts);
}

export function getTranslation(post: BlogPost, locale: Locale): PostTranslation {
  return post.translations[locale] ?? post.translations.es!;
}

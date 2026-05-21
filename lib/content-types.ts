export type Locale = "es" | "en" | "fr";

export type PostStatus = "draft" | "published";

export type BlockAlign = "left" | "center" | "right" | "full";

export type ContentBlock =
  | {
      id: string;
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      align: BlockAlign;
      width: "normal" | "wide" | "full";
    }
  | {
      id: string;
      type: "gallery";
      images: Array<{
        id: string;
        src: string;
        alt: string;
        caption?: string;
      }>;
    }
  | {
      id: string;
      type: "quote";
      text: string;
      byline?: string;
    }
  | {
      id: string;
      type: "divider";
    };

export type PostTranslation = {
  locale: Locale;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks: ContentBlock[];
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  status: PostStatus;
  coverImage: string;
  featured: boolean;
  font?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  translations: Partial<Record<Locale, PostTranslation>>;
};

export const LOCALES: Array<{ code: Locale; label: string; name: string }> = [
  { code: "es", label: "SPA", name: "Español" },
  { code: "en", label: "ENG", name: "English" },
  { code: "fr", label: "FRA", name: "Français" },
];

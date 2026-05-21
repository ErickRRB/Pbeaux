"use client";

import { ArrowLeft, Languages } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BlockRenderer } from "@/components/block-renderer";
import { SiteHeader } from "@/components/site-header";
import { BlogPost, Locale } from "@/lib/content-types";
import { getTranslation, loadStoredPosts } from "@/lib/content-store";
import { formatDate } from "@/lib/format";

type PostDetailClientProps = {
  slug: string;
};

export function PostDetailClient({ slug }: PostDetailClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    setPosts(loadStoredPosts());
  }, []);

  const post = useMemo(
    () => posts.find((item) => item.slug === slug),
    [posts, slug],
  );

  if (!post) {
    return (
      <>
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <main className="shell empty-state">
          <h1>Post no encontrado</h1>
          <p>Puede ser un borrador local o un slug que todavia no existe.</p>
          <Link className="button-link" href="/">
            Volver al inicio
          </Link>
        </main>
      </>
    );
  }

  const translation = getTranslation(post, locale);
  const selectedLocaleExists = Boolean(post.translations[locale]);

  return (
    <>
      <SiteHeader locale={locale} onLocaleChange={setLocale} />
      <main className="post-detail">
        <div className="shell">
          <Link className="back-link" href="/">
            <ArrowLeft size={16} />
            Volver
          </Link>
          <article>
            <header className="post-hero">
              <div className="post-hero-copy">
                <span className="eyebrow">{post.category}</span>
                <h1>{translation.title}</h1>
                <p>{translation.excerpt}</p>
                <div className="post-meta">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="locale-note">
                    <Languages size={14} />
                    {selectedLocaleExists
                      ? `Version ${locale.toUpperCase()}`
                      : "Mostrando version ES"}
                  </span>
                </div>
              </div>
              <figure>
                <img alt={translation.title} src={post.coverImage} />
              </figure>
            </header>
            <BlockRenderer blocks={translation.blocks} />
          </article>
        </div>
      </main>
    </>
  );
}

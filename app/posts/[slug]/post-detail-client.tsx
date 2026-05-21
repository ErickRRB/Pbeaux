"use client";

import { ArrowLeft, Languages } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BlockRenderer } from "@/components/block-renderer";
import { SiteHeader } from "@/components/site-header";
import { BlogPost, Locale } from "@/lib/content-types";
import { getTranslation } from "@/lib/content-store";
import { formatDate } from "@/lib/format";

type PostDetailClientProps = {
  post: BlogPost;
};

export function PostDetailClient({ post }: PostDetailClientProps) {
  const [locale, setLocale] = useState<Locale>("es");

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
          <article className={`font-${post.font ?? "editorial"}`}>
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

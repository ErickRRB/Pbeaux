"use client";

import { ChevronDown, Compass, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BlogPost, Locale } from "@/lib/content-types";
import { formatDate } from "@/lib/format";
import { getTranslation } from "@/lib/content-store";
import { SiteHeader } from "./site-header";

const collageImages = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=500&q=80",
];

type HomeClientProps = {
  initialPosts: BlogPost[];
};

export function HomeClient({ initialPosts }: HomeClientProps) {
  const [locale, setLocale] = useState<Locale>("es");
  const [query, setQuery] = useState("");

  const publishedPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialPosts
      .filter((post) => {
        if (!normalizedQuery) return true;
        const translation = getTranslation(post, locale);
        return `${translation.title} ${translation.excerpt} ${post.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  }, [locale, initialPosts, query]);

  const featured = publishedPosts.filter((post) => post.featured).slice(0, 2);
  const latest = publishedPosts.slice(0, 6);

  return (
    <>
      <section className="collage-hero">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <div className="shell collage-stage">
          <ImageStack images={collageImages.slice(0, 5)} />
          <div className="collage-center">
            <span className="eyebrow">
              <Sparkles size={14} />
              Revista digital
            </span>
            <h1>Historias que se sienten cerca</h1>
            <label className="search-box">
              <Search size={18} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cultura, lifestyle, marcas, lugares..."
                value={query}
              />
            </label>
            <div className="topic-tags">
              {["Tendencias", "Gastronomia", "Streaming", "Argentina"].map(
                (tag) => (
                  <span key={tag}>
                    <Compass size={13} />
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
          <ImageStack images={collageImages.slice(5)} />
        </div>
        <a aria-label="Ver contenido" className="scroll-hint" href="#posts">
          <ChevronDown size={26} />
        </a>
      </section>

      <main className="shell" id="posts">
        <section className="section-title">
          <div>
            <span className="eyebrow">Editor&apos;s choice</span>
            <h2>Notas destacadas</h2>
          </div>
          <p>
            Una selección breve para entrar directo a las historias con más
            pulso del momento.
          </p>
        </section>

        <section className="featured-layout">
          {featured.map((post) => {
            const translation = getTranslation(post, locale);
            return (
              <Link className="feature-card" href={`/posts/${post.slug}`} key={post.id}>
                <img alt={translation.title} src={post.coverImage} />
                <div className="overlay">
                  <span className="eyebrow">{post.category}</span>
                  <h3>{translation.title}</h3>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="section-title compact">
          <div>
            <span className="eyebrow">Ultimos posts</span>
            <h2>Archivo reciente</h2>
          </div>
        </section>

        <section className="post-grid">
          {latest.map((post) => {
            const translation = getTranslation(post, locale);
            return (
              <Link className="post-card" href={`/posts/${post.slug}`} key={post.id}>
                <figure>
                  <img alt={translation.title} src={post.coverImage} />
                </figure>
                <div className="copy">
                  <span className="eyebrow">{post.category}</span>
                  <h3>{translation.title}</h3>
                  <p>{translation.excerpt}</p>
                  <div className="post-meta">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>{post.translations[locale] ? locale.toUpperCase() : "ES"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </>
  );
}

function ImageStack({ images }: { images: string[] }) {
  return (
    <div className="tile-stack" aria-hidden="true">
      {images.map((image, index) => (
        <div
          className={`tile ${index === 0 || index === 2 ? "tall" : ""} ${
            index === 1 ? "wide" : ""
          }`}
          key={image}
        >
          <img alt="" src={image} />
        </div>
      ))}
    </div>
  );
}

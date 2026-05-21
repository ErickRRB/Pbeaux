"use client";

import {
  ArrowDown,
  ArrowUp,
  FileImage,
  Heading2,
  ImagePlus,
  LayoutGrid,
  ListPlus,
  LogOut,
  Pencil,
  Plus,
  Quote,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BlockRenderer } from "@/components/block-renderer";
import {
  BlockAlign,
  BlogPost,
  ContentBlock,
  Locale,
  LOCALES,
} from "@/lib/content-types";
import {
  cloneSeedPosts,
  getTranslation,
  loadStoredPosts,
  saveStoredPosts,
} from "@/lib/content-store";
import { createId, slugify } from "@/lib/format";

const fallbackAdminEmail = "bravopat@gmail.com";

export function AdminDashboard() {
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() || fallbackAdminEmail;
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [locale, setLocale] = useState<Locale>("es");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadedPosts = loadStoredPosts();
    setPosts(loadedPosts);
    setSelectedPostId(loadedPosts[0]?.id ?? "");
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0],
    [posts, selectedPostId],
  );

  const selectedTranslation = selectedPost
    ? getTranslation(selectedPost, locale)
    : undefined;

  function persist(nextPosts: BlogPost[], nextMessage = "Cambios guardados") {
    setPosts(nextPosts);
    saveStoredPosts(nextPosts);
    setMessage(nextMessage);
  }

  function updateSelectedPost(updater: (post: BlogPost) => BlogPost) {
    if (!selectedPost) {
      return;
    }

    const nextPosts = posts.map((post) =>
      post.id === selectedPost.id
        ? updater({ ...post, translations: { ...post.translations } })
        : post,
    );
    persist(nextPosts);
  }

  function updateTranslation(
    updater: (blocks: ContentBlock[]) => ContentBlock[],
  ) {
    updateSelectedPost((post) => {
      const translation = getTranslation(post, locale);
      const nextTranslation = {
        ...translation,
        locale,
        blocks: updater(translation.blocks),
      };

      return {
        ...post,
        updatedAt: new Date().toISOString(),
        translations: {
          ...post.translations,
          [locale]: nextTranslation,
        },
      };
    });
  }

  function handleLogin() {
    if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      setMessage(`Para este placeholder usa ${adminEmail}`);
      return;
    }

    setIsAuthenticated(true);
    setMessage("Sesion local iniciada");
  }

  function createPost() {
    const id = createId("post");
    const title = "Nuevo post";
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id,
      slug: slugify(title),
      category: "Lifestyle",
      status: "draft",
      coverImage:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      translations: {
        es: {
          locale: "es",
          title,
          excerpt: "Bajada breve del post.",
          blocks: [
            {
              id: createId("block"),
              type: "paragraph",
              text: "Escribi el primer parrafo del post.",
            },
          ],
        },
      },
    };

    const nextPosts = [newPost, ...posts];
    persist(nextPosts, "Post creado como borrador");
    setSelectedPostId(id);
    setLocale("es");
  }

  function deletePost() {
    if (!selectedPost) {
      return;
    }

    const nextPosts = posts.filter((post) => post.id !== selectedPost.id);
    persist(nextPosts, "Post eliminado localmente");
    setSelectedPostId(nextPosts[0]?.id ?? "");
  }

  function duplicateLocale() {
    if (!selectedPost) {
      return;
    }

    updateSelectedPost((post) => {
      const source = getTranslation(post, "es");
      return {
        ...post,
        translations: {
          ...post.translations,
          [locale]: {
            ...source,
            locale,
            title: `${source.title} (${locale.toUpperCase()})`,
          },
        },
      };
    });
  }

  function addBlock(type: ContentBlock["type"]) {
    const block = createBlock(type);
    updateTranslation((blocks) => [...blocks, block]);
  }

  function updateBlock(blockId: string, nextBlock: ContentBlock) {
    updateTranslation((blocks) =>
      blocks.map((block) => (block.id === blockId ? nextBlock : block)),
    );
  }

  function removeBlock(blockId: string) {
    updateTranslation((blocks) => blocks.filter((block) => block.id !== blockId));
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    updateTranslation((blocks) => {
      const index = blocks.findIndex((block) => block.id === blockId);
      const targetIndex = index + direction;

      if (index < 0 || targetIndex < 0 || targetIndex >= blocks.length) {
        return blocks;
      }

      const copy = [...blocks];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  }

  function restoreSeedData() {
    const nextPosts = cloneSeedPosts();
    persist(nextPosts, "Seeds restaurados");
    setSelectedPostId(nextPosts[0]?.id ?? "");
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-login">
        <section className="login-panel">
          <span className="eyebrow">Admin local</span>
          <h1>Entrar a PMag</h1>
          <p>
            Placeholder de login para avanzar la UI. En produccion esto se cambia
            por magic link de Supabase limitado a tu email.
          </p>
          <label>
            Email autorizado
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder={adminEmail}
              value={email}
            />
          </label>
          <button className="primary-button" onClick={handleLogin} type="button">
            Entrar
          </button>
          {message ? <p className="form-message">{message}</p> : null}
          <Link className="text-link" href="/">
            Volver a la home
          </Link>
        </section>
      </main>
    );
  }

  if (!selectedPost || !selectedTranslation) {
    return (
      <main className="admin-shell">
        <AdminTopbar onCreate={createPost} onLogout={() => setIsAuthenticated(false)} />
        <section className="empty-state">
          <h1>No hay posts</h1>
          <button className="primary-button" onClick={createPost} type="button">
            Crear primer post
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <AdminTopbar onCreate={createPost} onLogout={() => setIsAuthenticated(false)} />
      <div className="admin-layout">
        <aside className="post-list-panel">
          <div className="panel-heading">
            <span className="eyebrow">Posts</span>
            <button onClick={restoreSeedData} title="Restaurar seeds" type="button">
              <ListPlus size={18} />
            </button>
          </div>
          <div className="admin-post-list">
            {posts.map((post) => {
              const translation = getTranslation(post, "es");
              return (
                <button
                  className={post.id === selectedPost.id ? "active" : ""}
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  type="button"
                >
                  <span>{translation.title}</span>
                  <small>
                    {post.status} · {post.category}
                  </small>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="editor-panel">
          <div className="editor-toolbar top">
            <div className="language-tabs">
              {LOCALES.map((item) => (
                <button
                  className={locale === item.code ? "active" : ""}
                  key={item.code}
                  onClick={() => setLocale(item.code)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
            {!selectedPost.translations[locale] ? (
              <button className="secondary-button" onClick={duplicateLocale} type="button">
                Crear traduccion desde ES
              </button>
            ) : null}
          </div>

          <div className="post-fields">
            <label>
              Titulo
              <input
                onChange={(event) => {
                  const title = event.target.value;
                  updateSelectedPost((post) => ({
                    ...post,
                    slug: locale === "es" ? slugify(title) : post.slug,
                    translations: {
                      ...post.translations,
                      [locale]: {
                        ...selectedTranslation,
                        locale,
                        title,
                      },
                    },
                  }));
                }}
                value={selectedTranslation.title}
              />
            </label>
            <label>
              Bajada
              <textarea
                onChange={(event) =>
                  updateSelectedPost((post) => ({
                    ...post,
                    translations: {
                      ...post.translations,
                      [locale]: {
                        ...selectedTranslation,
                        locale,
                        excerpt: event.target.value,
                      },
                    },
                  }))
                }
                value={selectedTranslation.excerpt}
              />
            </label>
            <label>
              Slug
              <input
                onChange={(event) =>
                  updateSelectedPost((post) => ({
                    ...post,
                    slug: slugify(event.target.value),
                  }))
                }
                value={selectedPost.slug}
              />
            </label>
            <label>
              Categoria
              <input
                onChange={(event) =>
                  updateSelectedPost((post) => ({
                    ...post,
                    category: event.target.value,
                  }))
                }
                value={selectedPost.category}
              />
            </label>
            <label>
              Cover image URL
              <input
                onChange={(event) =>
                  updateSelectedPost((post) => ({
                    ...post,
                    coverImage: event.target.value,
                  }))
                }
                value={selectedPost.coverImage}
              />
            </label>
            <label>
              Estado
              <select
                onChange={(event) =>
                  updateSelectedPost((post) => ({
                    ...post,
                    status: event.target.value as BlogPost["status"],
                  }))
                }
                value={selectedPost.status}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="block-toolbar">
            <button onClick={() => addBlock("heading")} type="button">
              <Heading2 size={17} />
              Heading
            </button>
            <button onClick={() => addBlock("paragraph")} type="button">
              <Pencil size={17} />
              Texto
            </button>
            <button onClick={() => addBlock("image")} type="button">
              <ImagePlus size={17} />
              Imagen
            </button>
            <button onClick={() => addBlock("gallery")} type="button">
              <LayoutGrid size={17} />
              Galeria
            </button>
            <button onClick={() => addBlock("quote")} type="button">
              <Quote size={17} />
              Cita
            </button>
            <button onClick={() => addBlock("divider")} type="button">
              <Plus size={17} />
              Separador
            </button>
          </div>

          <div className="block-editor-list">
            {selectedTranslation.blocks.map((block, index) => (
              <BlockEditor
                block={block}
                key={block.id}
                onMoveDown={() => moveBlock(block.id, 1)}
                onMoveUp={() => moveBlock(block.id, -1)}
                onRemove={() => removeBlock(block.id)}
                onUpdate={(nextBlock) => updateBlock(block.id, nextBlock)}
                showMoveDown={index < selectedTranslation.blocks.length - 1}
                showMoveUp={index > 0}
              />
            ))}
          </div>

          <div className="editor-actions">
            <button className="primary-button" onClick={() => persist(posts)} type="button">
              <Save size={17} />
              Guardar local
            </button>
            <button className="danger-button" onClick={deletePost} type="button">
              <Trash2 size={17} />
              Delete post
            </button>
            {message ? <span>{message}</span> : null}
          </div>
        </section>

        <aside className="preview-panel">
          <span className="eyebrow">Preview</span>
          <h2>{selectedTranslation.title}</h2>
          <p>{selectedTranslation.excerpt}</p>
          <figure className="preview-cover">
            <img alt={selectedTranslation.title} src={selectedPost.coverImage} />
          </figure>
          <BlockRenderer blocks={selectedTranslation.blocks} />
        </aside>
      </div>
    </main>
  );
}

function AdminTopbar({
  onCreate,
  onLogout,
}: {
  onCreate: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="admin-topbar">
      <Link className="brand" href="/">
        PMag
      </Link>
      <div>
        <button className="secondary-button" onClick={onCreate} type="button">
          <Plus size={17} />
          New post
        </button>
        <button className="icon-button" onClick={onLogout} title="Salir" type="button">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

function BlockEditor({
  block,
  onMoveDown,
  onMoveUp,
  onRemove,
  onUpdate,
  showMoveDown,
  showMoveUp,
}: {
  block: ContentBlock;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onUpdate: (block: ContentBlock) => void;
  showMoveDown: boolean;
  showMoveUp: boolean;
}) {
  return (
    <section className="block-editor-card">
      <div className="block-card-header">
        <span>{block.type}</span>
        <div>
          <button disabled={!showMoveUp} onClick={onMoveUp} title="Subir" type="button">
            <ArrowUp size={16} />
          </button>
          <button
            disabled={!showMoveDown}
            onClick={onMoveDown}
            title="Bajar"
            type="button"
          >
            <ArrowDown size={16} />
          </button>
          <button onClick={onRemove} title="Eliminar bloque" type="button">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <BlockFields block={block} onUpdate={onUpdate} />
    </section>
  );
}

function BlockFields({
  block,
  onUpdate,
}: {
  block: ContentBlock;
  onUpdate: (block: ContentBlock) => void;
}) {
  if (block.type === "heading") {
    return (
      <div className="block-fields">
        <label>
          Texto
          <input
            onChange={(event) => onUpdate({ ...block, text: event.target.value })}
            value={block.text}
          />
        </label>
        <label>
          Nivel
          <select
            onChange={(event) =>
              onUpdate({ ...block, level: Number(event.target.value) as 2 | 3 })
            }
            value={block.level}
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </label>
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <label className="block-fields">
        Texto
        <textarea
          onChange={(event) => onUpdate({ ...block, text: event.target.value })}
          value={block.text}
        />
      </label>
    );
  }

  if (block.type === "quote") {
    return (
      <div className="block-fields">
        <label>
          Cita
          <textarea
            onChange={(event) => onUpdate({ ...block, text: event.target.value })}
            value={block.text}
          />
        </label>
        <label>
          Autor
          <input
            onChange={(event) => onUpdate({ ...block, byline: event.target.value })}
            value={block.byline ?? ""}
          />
        </label>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="block-fields">
        <ImageInput
          label="Imagen"
          onChange={(src) => onUpdate({ ...block, src })}
          value={block.src}
        />
        <label>
          Alt
          <input
            onChange={(event) => onUpdate({ ...block, alt: event.target.value })}
            value={block.alt}
          />
        </label>
        <label>
          Caption
          <input
            onChange={(event) =>
              onUpdate({ ...block, caption: event.target.value })
            }
            value={block.caption ?? ""}
          />
        </label>
        <label>
          Alineacion
          <select
            onChange={(event) =>
              onUpdate({ ...block, align: event.target.value as BlockAlign })
            }
            value={block.align}
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label>
          Tamaño
          <select
            onChange={(event) =>
              onUpdate({
                ...block,
                width: event.target.value as "normal" | "wide" | "full",
              })
            }
            value={block.width}
          >
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
            <option value="full">Full</option>
          </select>
        </label>
      </div>
    );
  }

  if (block.type === "gallery") {
    return (
      <div className="block-fields">
        {block.images.map((image, index) => (
          <div className="gallery-admin-item" key={image.id}>
            <ImageInput
              label={`Imagen ${index + 1}`}
              onChange={(src) =>
                onUpdate({
                  ...block,
                  images: block.images.map((item) =>
                    item.id === image.id ? { ...item, src } : item,
                  ),
                })
              }
              value={image.src}
            />
            <input
              onChange={(event) =>
                onUpdate({
                  ...block,
                  images: block.images.map((item) =>
                    item.id === image.id
                      ? { ...item, alt: event.target.value }
                      : item,
                  ),
                })
              }
              placeholder="Alt"
              value={image.alt}
            />
          </div>
        ))}
        <button
          className="secondary-button"
          onClick={() =>
            onUpdate({
              ...block,
              images: [
                ...block.images,
                {
                  id: createId("image"),
                  src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
                  alt: "Nueva imagen",
                },
              ],
            })
          }
          type="button"
        >
          <FileImage size={17} />
          Agregar imagen a galeria
        </button>
      </div>
    );
  }

  return <p className="muted">Separador visual.</p>;
}

function ImageInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    onChange(dataUrl);
  }

  return (
    <div className="image-input">
      <label>
        {label} URL
        <input onChange={(event) => onChange(event.target.value)} value={value} />
      </label>
      <label className="file-button">
        <ImagePlus size={17} />
        Subir archivo local
        <input accept="image/*" onChange={handleFile} type="file" />
      </label>
    </div>
  );
}

function createBlock(type: ContentBlock["type"]): ContentBlock {
  const id = createId("block");

  if (type === "heading") {
    return { id, type, level: 2, text: "Nuevo subtitulo" };
  }

  if (type === "paragraph") {
    return { id, type, text: "Nuevo parrafo del post." };
  }

  if (type === "image") {
    return {
      id,
      type,
      src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      alt: "Imagen del post",
      caption: "",
      align: "center",
      width: "wide",
    };
  }

  if (type === "gallery") {
    return {
      id,
      type,
      images: [
        {
          id: createId("image"),
          src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
          alt: "Imagen de galeria",
        },
        {
          id: createId("image"),
          src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
          alt: "Imagen de galeria",
        },
      ],
    };
  }

  if (type === "quote") {
    return { id, type, text: "Nueva cita destacada.", byline: "" };
  }

  return { id, type: "divider" };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

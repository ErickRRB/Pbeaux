"use client";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  FileImage,
  Heading2,
  ImagePlus,
  LayoutGrid,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Quote,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { BlockRenderer } from "@/components/block-renderer";
import {
  BlockAlign,
  BlogPost,
  ContentBlock,
  Locale,
  LOCALES,
} from "@/lib/content-types";
import { getTranslation } from "@/lib/content-store";
import { createId, slugify } from "@/lib/format";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [locale, setLocale] = useState<Locale>("es");
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [password, setPassword] = useState("");

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0],
    [posts, selectedPostId],
  );

  const selectedTranslation = selectedPost
    ? getTranslation(selectedPost, locale)
    : undefined;

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const res = await fetch("/api/admin/posts");
    if (res.ok) {
      const data: BlogPost[] = await res.json();
      setPosts(data);
      setSelectedPostId(data[0]?.id ?? "");
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await checkAuth();
    } else {
      setMessage("Contraseña incorrecta");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPosts([]);
    setPassword("");
    setMessage("");
  }

  function updateSelectedPost(updater: (post: BlogPost) => BlogPost) {
    if (!selectedPost) return;
    const nextPosts = posts.map((post) =>
      post.id === selectedPost.id
        ? updater({ ...post, translations: { ...post.translations } })
        : post,
    );
    setPosts(nextPosts);
    setIsDirty(true);
    setMessage("");
  }

  function updateTranslation(
    updater: (blocks: ContentBlock[]) => ContentBlock[],
  ) {
    updateSelectedPost((post) => {
      const translation = getTranslation(post, locale);
      return {
        ...post,
        updatedAt: new Date().toISOString(),
        translations: {
          ...post.translations,
          [locale]: { ...translation, locale, blocks: updater(translation.blocks) },
        },
      };
    });
  }

  async function savePost() {
    if (!selectedPost || isSaving) return;
    setIsSaving(true);
    setMessage("Guardando...");
    try {
      const res = await fetch(`/api/admin/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      });
      if (res.ok) {
        setIsDirty(false);
        setMessage("Guardado en Supabase ✓");
      } else {
        setMessage("Error al guardar");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function createPost() {
    const id = crypto.randomUUID();
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

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      setPosts([newPost, ...posts]);
      setSelectedPostId(id);
      setLocale("es");
      setIsDirty(false);
      setMessage("Post creado");
    } else {
      setMessage("Error al crear el post");
    }
  }

  async function deletePost() {
    if (!selectedPost) return;
    const res = await fetch(`/api/admin/posts/${selectedPost.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const nextPosts = posts.filter((post) => post.id !== selectedPost.id);
      setPosts(nextPosts);
      setSelectedPostId(nextPosts[0]?.id ?? "");
      setIsDirty(false);
      setMessage("Post eliminado");
    } else {
      setMessage("Error al eliminar");
    }
  }

  function duplicateLocale() {
    if (!selectedPost) return;
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
    updateTranslation((blocks) => [...blocks, createBlock(type)]);
  }

  function updateBlock(blockId: string, nextBlock: ContentBlock) {
    updateTranslation((blocks) =>
      blocks.map((block) => (block.id === blockId ? nextBlock : block)),
    );
  }

  function removeBlock(blockId: string) {
    updateTranslation((blocks) =>
      blocks.filter((block) => block.id !== blockId),
    );
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

  // --- Pantalla de carga mientras verifica la sesión ---
  if (isAuthenticated === null) {
    return (
      <main className="admin-login">
        <div className="login-panel">
          <span className="eyebrow">Admin</span>
          <p className="muted">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  // --- Pantalla de login ---
  if (!isAuthenticated) {
    return (
      <main className="admin-login">
        <form
          className="login-panel"
          onSubmit={handleLogin}
        >
          <span className="eyebrow">Admin</span>
          <h1>Entrar a PMag</h1>
          <p>
            Acceso privado para gestionar posts. El contenido se guarda
            directamente en Supabase y es visible para todos los visitantes.
          </p>
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña de admin"
              type="password"
              value={password}
            />
          </label>
          <div className="login-actions">
            <button className="primary-button" type="submit">
              Entrar
            </button>
            <Link className="secondary-button" href="/">
              Volver a la home
            </Link>
          </div>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  // --- Estado vacío ---
  if (!selectedPost || !selectedTranslation) {
    return (
      <main className="admin-shell">
        <AdminTopbar onCreate={createPost} onLogout={handleLogout} />
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
      <AdminTopbar onCreate={createPost} onLogout={handleLogout} />
      <div className={`admin-layout${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
        <aside className={`post-list-panel${sidebarCollapsed ? " collapsed" : ""}`}>
          <div className="panel-heading">
            {!sidebarCollapsed && <span className="eyebrow">Posts</span>}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setSidebarCollapsed((v) => !v)}
                title={sidebarCollapsed ? "Expandir panel" : "Minimizar panel"}
                type="button"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </button>
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="admin-post-list">
              {posts.map((post) => {
                const translation = getTranslation(post, "es");
                return (
                  <button
                    className={post.id === selectedPost.id ? "active" : ""}
                    key={post.id}
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setIsDirty(false);
                      setMessage("");
                    }}
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
          )}
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
              <button
                className="secondary-button"
                onClick={duplicateLocale}
                type="button"
              >
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
                      [locale]: { ...selectedTranslation, locale, title },
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
            <div className="cover-image-field">
              <ImageInput
                label="Cover image"
                onChange={(coverImage) =>
                  updateSelectedPost((post) => ({ ...post, coverImage }))
                }
                value={selectedPost.coverImage}
              />
              {selectedPost.coverImage && (
                <img
                  alt="cover preview"
                  className="cover-image-preview"
                  src={selectedPost.coverImage}
                />
              )}
            </div>
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
            <button
              className="primary-button"
              disabled={isSaving || !isDirty}
              onClick={savePost}
              type="button"
            >
              <Save size={17} />
              {isSaving ? "Guardando..." : isDirty ? "Guardar" : "Sin cambios"}
            </button>
            <button className="danger-button" onClick={deletePost} type="button">
              <Trash2 size={17} />
              Eliminar post
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
        <Link className="secondary-button" href="/">
          <Eye size={17} />
          Ver sitio
        </Link>
        <button className="secondary-button" onClick={onCreate} type="button">
          <Plus size={17} />
          New post
        </button>
        <button className="secondary-button" onClick={onLogout} type="button">
          <LogOut size={18} />
          Logout
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
            placeholder="Subtítulo del post"
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
          placeholder="Escribí el párrafo aquí..."
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
            placeholder="Texto de la cita destacada"
            value={block.text}
          />
        </label>
        <label>
          Autor
          <input
            onChange={(event) => onUpdate({ ...block, byline: event.target.value })}
            placeholder="Nombre o fuente"
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
      } else {
        const { error } = await res.json();
        setUploadError(error ?? "Error al subir");
      }
    } catch {
      setUploadError("Error de red al subir");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="image-input">
      <label>
        {label} URL
        <input onChange={(event) => onChange(event.target.value)} value={value} />
      </label>
      <label className={`file-button${uploading ? " uploading" : ""}`}>
        <ImagePlus size={17} />
        {uploading ? "Subiendo..." : "Subir desde PC"}
        <input accept="image/*" disabled={uploading} onChange={handleFile} type="file" />
      </label>
      {uploadError ? <span className="upload-error">{uploadError}</span> : null}
    </div>
  );
}

function createBlock(type: ContentBlock["type"]): ContentBlock {
  const id = createId("block");
  if (type === "heading") return { id, type, level: 2, text: "" };
  if (type === "paragraph") return { id, type, text: "" };
  if (type === "image") {
    return { id, type, src: "", alt: "", caption: "", align: "center", width: "wide" };
  }
  if (type === "gallery") {
    return {
      id, type,
      images: [
        { id: createId("image"), src: "", alt: "" },
        { id: createId("image"), src: "", alt: "" },
      ],
    };
  }
  if (type === "quote") return { id, type, text: "", byline: "" };
  return { id, type: "divider" };
}


# Pbeaux - Plan de desarrollo

## Objetivo

Crear una nueva version from scratch de PMag, reemplazando el sitio actual en Mozello por una web propia con diseño editorial, gestion simple de posts, soporte multi-idioma manual y administracion privada.

## Direccion de producto

- Base visual elegida: opcion A, "Collage editorial".
- Idioma default: español.
- Idiomas adicionales: ingles y frances como traducciones manuales por post.
- Experiencia de escritura: simple para usuario no tecnico, con foco en imagenes dentro del contenido.
- Migracion inicial: importar al menos los ultimos 4 o 5 posts actuales de Mozello.

## Stack propuesto

### Fase local con placeholders

- Next.js para frontend, detalle de posts y admin.
- Docker Compose para levantar servicios locales.
- Base de datos local para posts, traducciones y assets.
- Storage local para imagenes durante desarrollo.
- Login local simulado limitado al email autorizado.
- Seeds con posts migrados desde Mozello.

### Fase productiva

- Vercel para deploy web.
- Supabase Auth para magic link por email.
- Supabase Postgres para contenido.
- Supabase Storage para portadas e imagenes embebidas.
- Dominio propio cuando se defina.

## Arquitectura funcional

```text
Home /
  Hero collage editorial
  Buscador
  Categorias
  Posts destacados
  Grilla de ultimos posts

Post /posts/[slug]
  Version por idioma
  Portada
  Contenido por bloques
  Imagenes embebidas
  Metadata SEO

Admin /admin
  Login
  Listado de posts
  Nuevo post
  Editar post
  Eliminar post
  Draft / Published
  Traducciones SPA / ENG / FRA
```

## Modelo de contenido inicial

### Post

- id
- slug
- status: draft | published
- category
- cover_image
- featured
- created_at
- updated_at
- published_at

### PostTranslation

- id
- post_id
- locale: es | en | fr
- title
- excerpt
- content_blocks
- seo_title
- seo_description

### ContentBlock

El contenido se guardara como JSON ordenado.

Tipos iniciales:

- paragraph
- heading
- image
- gallery
- quote
- divider
- two_columns
- link_button

## Editor definido

Opcion principal confirmada: editor por bloques visuales.

Motivo:

- Permite insertar imagenes en posiciones concretas sin escribir codigo.
- Evita que el contenido pegado rompa el layout.
- Es mas sencillo de evolucionar que un editor visual libre.
- Guarda datos estructurados, utiles para SEO, migracion y render estable.

Alternativas evaluadas y descartadas para la primera version:

- Editor visual clasico: mas parecido a Word, pero puede generar HTML sucio.
- Markdown + preview: robusto, pero menos amigable para usuario no tecnico.

## Migracion inicial desde Mozello

Posts candidatos iniciales detectados en la home actual:

1. La segunda parte de Cien años de soledad llegara a Netflix en agosto de 2026
2. Especial Belleza Fatal lanza trailer y poster oficial
3. Gurisa abre temporada: una propuesta que une Uruguay y Europa
4. Esta Navidad MacStation y Casa Ronald Argentina presentan la campaña solidaria "Conectados para Transformar"
5. Airbnb lanza nueva funcion para educar huespedes en seguridad en el agua

Pendiente:

- Descargar/copiar imagenes relevantes.
- Normalizar titulos, slugs y excerpts.
- Confirmar si se importan comentarios o se descartan.
- Confirmar si se preservan fechas originales.

## Fases

### Fase 0 - Prototipo visual

- Crear prototipos HTML.
- Elegir direccion visual.
- Documentar decisiones.

### Fase 1 - Base tecnica local

- Inicializar app Next.js.
- Agregar Docker Compose.
- Crear modelo de datos local.
- Crear seeds con posts migrados.
- Renderizar home y detalle desde datos locales.

### Fase 2 - Admin local

- Login placeholder.
- CRUD de posts.
- Editor por bloques.
- Upload local de imagenes.
- Soporte SPA / ENG / FRA.

### Fase 3 - Integracion Supabase

- Crear variables de entorno.
- Reemplazar auth local por Supabase Auth.
- Reemplazar DB local por Supabase Postgres.
- Reemplazar storage local por Supabase Storage.

### Fase 4 - Deploy

- Deploy en Vercel.
- Configurar dominio.
- Verificar SEO, metadata y performance.
- Definir proceso de migracion final desde Mozello.

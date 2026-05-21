# Pbeaux - Backlog

## Estado actual

Proyecto en etapa de definicion y prototipo. La base visual elegida es "Collage editorial".

## Hecho

- Se reviso el sitio actual: https://pmag.mozello.com/
- Se crearon tres propuestas HTML iniciales.
- Se eligio la opcion A: Collage editorial.
- Se definio mantener multi-idioma con español como default.
- Se definio que las traducciones seran manuales por post.
- Se definio explorar un editor simple para usuario no tecnico.
- Se eligio editor por bloques visuales como editor principal.
- Se definio migrar los ultimos 4 o 5 posts actuales.
- Se eligio stack recomendado: Next.js + Supabase + Vercel.
- Se acepto trabajar primero con placeholders locales en Docker.
- Se inicializo app Next.js en la raiz del repo.
- Se implemento home con hero collage editorial.
- Se implemento detalle de post en `/posts/[slug]`.
- Se implemento admin local en `/admin`.
- Se implemento editor por bloques visuales con texto, heading, imagen, galeria, cita y separador.
- Se implemento seleccion de idioma SPA/ENG/FRA y creacion de traduccion desde ES.
- Se agregaron seeds locales con los 5 posts iniciales detectados desde Mozello.
- Se agrego Dockerfile y docker-compose para desarrollo local en `localhost:3001`.
- Se valido `npm run typecheck` y `npm run build`.

## Pendiente inmediato

- Revisar visualmente la app en navegador y ajustar detalles responsive.
- Definir si el editor por bloques queda custom o se reemplaza por libreria dedicada.
- Conectar persistencia real local: Postgres/Prisma o Supabase local.
- Implementar upload persistente de imagenes en storage local.
- Extraer contenido real completo de los posts de Mozello.
- Convertir posts migrados a bloques reales.
- Definir email real autorizado para admin.

## Backlog funcional

### Public site

- Home editorial con hero collage.
- Cards de posts.
- Posts destacados.
- Filtro por categoria.
- Buscador.
- Selector de idioma.
- Pagina de detalle de post.
- SEO por post.
- Sitemap.
- RSS opcional.

### Admin

- Login por email autorizado. Estado: placeholder local.
- Listado de posts. Estado: implementado local.
- Crear post. Estado: implementado local.
- Editar post. Estado: implementado local.
- Eliminar post. Estado: implementado local.
- Guardar borrador. Estado: implementado local.
- Publicar/despublicar. Estado: implementado local.
- Subir imagen de portada. Estado: pendiente.
- Insertar imagenes dentro del contenido. Estado: implementado con URL/data URL local.
- Reordenar bloques. Estado: implementado local.
- Crear traduccion EN/FR a partir del post ES. Estado: implementado local.
- Preview antes de publicar. Estado: implementado local.

### Migracion

- Importar ultimos 5 posts desde Mozello.
- Descargar imagenes.
- Convertir contenido a bloques.
- Revisar slugs.
- Revisar fechas.

### Infra

- Docker local.
- Variables `.env.example`.
- Adapter local para DB/storage.
- Adapter Supabase.
- Deploy Vercel.

## Decisiones pendientes

- Email autorizado para admin.
- Dominio final.
- Si se mantienen comentarios.
- Si los posts viejos se migran completos o solo los recientes.
- Politica de borrado: delete real o soft delete.

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

## Pendiente inmediato

- Crear app Next.js dentro del repo.
- Migrar el prototipo A al frontend real.
- Elegir libreria/base tecnica para el editor por bloques.
- Crear Docker Compose local.
- Definir schema inicial de posts/traducciones/bloques.
- Crear seeds con posts migrados desde Mozello.
- Implementar home con datos locales.
- Implementar pagina de detalle de post.
- Implementar admin local con login placeholder.

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

- Login por email autorizado.
- Listado de posts.
- Crear post.
- Editar post.
- Eliminar post.
- Guardar borrador.
- Publicar/despublicar.
- Subir imagen de portada.
- Insertar imagenes dentro del contenido.
- Reordenar bloques.
- Crear traduccion EN/FR a partir del post ES.
- Preview antes de publicar.

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

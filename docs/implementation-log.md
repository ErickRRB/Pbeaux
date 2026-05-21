# Pbeaux - Implementation log

## 2026-05-21

### Contexto

El usuario quiere reemplazar el sitio actual de PMag en Mozello por una pagina/blog propia, diseñada desde cero.

### Decisiones tomadas

- Diseño elegido: opcion A, hero collage editorial.
- Se mantiene multi-idioma.
- Español sera el idioma default.
- Ingles y frances se cargaran manualmente cuando exista traduccion del post.
- Se prefiere un editor muy simple para usuario no tecnico.
- El editor principal queda definido como editor por bloques visuales.
- Se quiere migrar al menos los ultimos 4 o 5 posts actuales.
- Stack recomendado aceptado: Next.js + Supabase + Vercel.
- Durante desarrollo se puede trabajar con placeholders locales en Docker.

### Prototipo existente

Archivo local con propuestas:

```text
/Users/erick/Documents/New project 2/index.html
```

Servidor local usado:

```text
http://127.0.0.1:5173/
```

### Notas de implementacion

- El contenido del editor deberia persistirse como JSON de bloques, no como HTML libre, para mantener diseño consistente.
- Las traducciones deberian ser registros separados asociados al mismo post.
- El admin deberia permitir crear primero en español y luego agregar EN/FR desde el mismo post.
- La migracion desde Mozello debe descargar imagenes y no depender de URLs externas en produccion.

### Proximo paso recomendado

Inicializar la app Next.js en este repo, traer el prototipo A como base visual y crear el primer schema local con seeds.

## 2026-05-21 - Primera implementacion

### Implementado

- App Next.js inicializada en la raiz del repo.
- Home `/` con direccion visual "Collage editorial".
- Selector de idioma `SPA / ENG / FRA` con español como fallback.
- Busqueda local por titulo, bajada y categoria.
- Cards de posts y destacados.
- Detalle `/posts/[slug]` con render de bloques.
- Admin `/admin` con login placeholder por `NEXT_PUBLIC_ADMIN_EMAIL`.
- CRUD local de posts usando `localStorage`.
- Editor por bloques visuales:
  - heading
  - paragraph
  - image
  - gallery
  - quote
  - divider
- Reordenamiento de bloques.
- Imagen por URL y carga local como data URL para prototipo.
- Traducciones manuales por post, creando EN/FR desde ES.
- Seeds con los 5 posts iniciales candidatos desde Mozello.
- Dockerfile y `docker-compose.yml` para desarrollo local.
- Docker expone la app en `http://localhost:3001` para evitar choque con otro proceso local en `3000`.
- Se ocultaron los accesos publicos a `Posts` y `Admin`; el admin queda como acceso directo por URL `/admin`.
- El login placeholder acepta `bravopat@gmail.com` sin magic link.

### Validacion

```bash
npm run typecheck
npm run build
```

Ambos comandos pasaron correctamente.

### Limitaciones actuales

- La persistencia todavia es `localStorage`.
- El upload de imagenes todavia no usa storage persistente.
- El login es placeholder local, no magic link real.
- Los posts migrados tienen contenido placeholder, falta extraer el cuerpo completo de Mozello.

### Proximo paso recomendado

Levantar la app en navegador, revisar experiencia del admin y despues conectar persistencia local real antes de Supabase.

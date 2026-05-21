# Pbeaux

Nueva version from scratch de PMag.

## Direccion actual

- Diseño base: Collage editorial.
- Idioma default: español.
- Traducciones manuales por post: ingles y frances.
- Editor definido: bloques visuales.
- Stack objetivo: Next.js + Supabase + Vercel.
- Desarrollo inicial: placeholders locales con Docker.

## Documentacion viva

- [Plan de desarrollo](docs/plan.md)
- [Backlog](docs/backlog.md)
- [Implementation log](docs/implementation-log.md)
- [Opciones de editor](docs/editor-options.md)
- [Migracion desde Mozello](docs/migration-mozello.md)

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Admin local:

```text
http://localhost:3000/admin
```

El email del login placeholder se configura con:

```bash
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

Tambien se puede levantar con Docker:

```bash
docker compose up --build
```

Con Docker, la app queda expuesta en:

```text
http://localhost:3001
```

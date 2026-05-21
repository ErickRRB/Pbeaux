# Deploy free tier - Vercel + Supabase

## Estado actual

La app ya puede desplegarse en Vercel como MVP visual y de flujo admin local.

Limitacion actual:

- El contenido se guarda en `localStorage` del navegador.
- El login actual es un control local por email, sin magic link.
- Supabase todavia no esta conectado al codigo de persistencia.

Esto permite probar diseño, navegación y editor. La siguiente fase es reemplazar `localStorage` por Supabase Auth + Postgres + Storage.

## 1. Crear proyecto en Supabase gratis

1. Entrar a https://supabase.com/
2. Crear cuenta o iniciar sesion.
3. Crear nuevo proyecto.
4. Elegir plan Free.
5. Guardar estos datos:
   - Project URL
   - anon public key
   - service role key, solo para scripts backend o migraciones
6. En Authentication > Providers, dejar Email habilitado.
7. En Authentication > URL Configuration, agregar luego la URL de Vercel:
   - `https://<tu-proyecto>.vercel.app`
   - `https://<tu-proyecto>.vercel.app/admin`

## 2. Tablas recomendadas en Supabase

Cuando conectemos persistencia real, usar este modelo:

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  status text not null check (status in ('draft', 'published')),
  cover_image text not null,
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table post_translations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  locale text not null check (locale in ('es', 'en', 'fr')),
  title text not null,
  excerpt text not null,
  seo_title text,
  seo_description text,
  blocks jsonb not null default '[]'::jsonb,
  unique (post_id, locale)
);
```

## 3. Storage en Supabase

1. Ir a Storage.
2. Crear bucket `post-images`.
3. Para primera version, dejar subida solo desde admin autenticado.
4. Reglas recomendadas:
   - lectura publica para imagenes publicadas
   - escritura solo para usuario autenticado permitido

## 4. Crear proyecto en Vercel gratis

1. Entrar a https://vercel.com/
2. Conectar GitHub.
3. Importar repo `ErickRRB/Pbeaux`.
4. Framework Preset: Next.js.
5. Install command: `pnpm install --frozen-lockfile`.
6. Build command: `pnpm build`.
7. Output directory: dejar default.
8. Plan: Free.

## 5. Variables de entorno en Vercel

En Vercel > Project Settings > Environment Variables:

```text
NEXT_PUBLIC_ADMIN_EMAIL=bravopat@gmail.com
```

Cuando conectemos Supabase:

```text
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.

## 6. Deploy sin dominio pago

Vercel entrega una URL gratuita:

```text
https://<nombre-del-proyecto>.vercel.app
```

Con eso ya se puede probar la web sin comprar dominio.

## 7. Checklist antes de publicar

- Confirmar que no haya links publicos a `/admin`.
- Confirmar que `/admin` abre solo por URL directa.
- Confirmar `pnpm build`.
- Confirmar `pnpm audit --prod`.
- Definir si se publica con contenido seed o si antes se migran posts reales.

## 8. Siguiente fase tecnica

1. Instalar cliente Supabase.
2. Reemplazar `lib/content-store.ts` por adapter Supabase.
3. Agregar magic link real.
4. Guardar imagenes en bucket `post-images`.
5. Migrar seeds actuales a Supabase.
6. Proteger acciones admin con sesion real.

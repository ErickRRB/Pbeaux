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

import { BlogPost } from "./content-types";

const now = "2026-05-21T00:00:00.000Z";

export const seedPosts: BlogPost[] = [
  {
    id: "post-cien-anos-soledad-netflix-2026",
    slug: "cien-anos-soledad-netflix-agosto-2026",
    category: "Lifestyle",
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    publishedAt: "2025-12-11T10:00:00.000Z",
    createdAt: now,
    updatedAt: now,
    translations: {
      es: {
        locale: "es",
        title:
          "La segunda parte de Cien años de soledad llegara a Netflix en agosto de 2026",
        excerpt:
          "Una nota migrada como placeholder inicial desde PMag/Mozello para probar el nuevo formato editorial.",
        blocks: [
          {
            id: "b1",
            type: "heading",
            level: 2,
            text: "Un regreso esperado",
          },
          {
            id: "b2",
            type: "paragraph",
            text: "Este contenido funciona como base de migracion. En la version final se reemplazara por el texto completo importado y revisado desde Mozello.",
          },
          {
            id: "b3",
            type: "image",
            src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
            alt: "Sala de cine con proyector",
            caption: "Imagen placeholder para validar posicion dentro del post.",
            align: "center",
            width: "wide",
          },
          {
            id: "b4",
            type: "paragraph",
            text: "La nueva plataforma permitira conservar esta nota en español y agregar traducciones manuales en ingles o frances cuando esten listas.",
          },
        ],
      },
    },
  },
  {
    id: "post-belleza-fatal-trailer",
    slug: "especial-belleza-fatal-trailer-poster",
    category: "Streaming",
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    publishedAt: "2025-12-11T09:00:00.000Z",
    createdAt: now,
    updatedAt: now,
    translations: {
      es: {
        locale: "es",
        title: "Especial Belleza Fatal lanza trailer y poster oficial",
        excerpt:
          "Preview de nota de entretenimiento para validar cards, categorias y detalle de post.",
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Texto placeholder del articulo. La migracion real convertira el contenido original a bloques editables.",
          },
          {
            id: "b2",
            type: "quote",
            text: "El editor por bloques mantiene el diseño estable aunque el contenido crezca.",
          },
        ],
      },
    },
  },
  {
    id: "post-gurisa-temporada",
    slug: "gurisa-temporada-uruguay-europa",
    category: "Gastronomia",
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: "2025-12-06T10:00:00.000Z",
    createdAt: now,
    updatedAt: now,
    translations: {
      es: {
        locale: "es",
        title: "Gurisa abre temporada: una propuesta que une Uruguay y Europa",
        excerpt:
          "Una entrada lifestyle/gourmet preparada para validar imagenes, bajadas y metadata.",
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Contenido inicial de demostracion para el flujo de lectura del nuevo PMag.",
          },
          {
            id: "b2",
            type: "gallery",
            images: [
              {
                id: "g1",
                src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
                alt: "Restaurante iluminado",
                caption: "Ambiente",
              },
              {
                id: "g2",
                src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
                alt: "Plato servido",
                caption: "Mesa",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "post-macstation-casa-ronald",
    slug: "macstation-casa-ronald-conectados-para-transformar",
    category: "Marcas",
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: "2025-12-06T09:00:00.000Z",
    createdAt: now,
    updatedAt: now,
    translations: {
      es: {
        locale: "es",
        title:
          'Esta Navidad MacStation y Casa Ronald Argentina presentan la campaña solidaria "Conectados para Transformar"',
        excerpt:
          "Nota placeholder para revisar titulos largos, cards y comportamiento responsive.",
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Los titulos largos tienen que verse bien en home, grillas y detalle. Este post valida ese caso.",
          },
          {
            id: "b2",
            type: "divider",
          },
          {
            id: "b3",
            type: "paragraph",
            text: "El editor final permitira publicar, despublicar y guardar borradores sin depender de Mozello.",
          },
        ],
      },
    },
  },
  {
    id: "post-airbnb-seguridad-agua",
    slug: "airbnb-seguridad-en-el-agua",
    category: "Viajes",
    status: "published",
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: "2025-12-04T10:00:00.000Z",
    createdAt: now,
    updatedAt: now,
    translations: {
      es: {
        locale: "es",
        title:
          "Airbnb lanza nueva funcion para educar huespedes en seguridad en el agua",
        excerpt:
          "Post migrable para probar categoria viajes y grilla de ultimos articulos.",
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Este registro sirve para probar la migracion inicial de los ultimos posts desde el sitio actual.",
          },
        ],
      },
    },
  },
];

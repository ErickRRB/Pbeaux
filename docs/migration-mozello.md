# Pbeaux - Migracion desde Mozello

## Fuente actual

Sitio actual:

```text
https://pmag.mozello.com/
```

## Objetivo inicial

Importar los ultimos 4 o 5 posts para tener contenido real durante desarrollo y una base visible al publicar la nueva version.

## Posts candidatos

1. La segunda parte de Cien años de soledad llegara a Netflix en agosto de 2026
   - Fecha vista: 11 dic, 2025
   - Categoria actual: Lifestyle

2. Especial Belleza Fatal lanza trailer y poster oficial
   - Fecha vista: 11 dic, 2025
   - Categoria actual: Lifestyle

3. Gurisa abre temporada: una propuesta que une Uruguay y Europa
   - Fecha vista: 6 dic, 2025
   - Categoria actual: Lifestyle

4. Esta Navidad MacStation y Casa Ronald Argentina presentan la campaña solidaria "Conectados para Transformar"
   - Fecha vista: 6 dic, 2025
   - Categoria actual: Lifestyle

5. Airbnb lanza nueva funcion para educar huespedes en seguridad en el agua
   - Fecha vista: 4 dic, 2025
   - Categoria actual: Lifestyle

## Reglas de migracion propuestas

- Preservar fecha original si es confiable.
- Crear slug nuevo limpio en español.
- Guardar contenido inicial solo en `es`.
- Dejar `en` y `fr` vacios hasta que el usuario cargue traducciones.
- Descargar imagenes y guardarlas en storage propio.
- No depender de hotlinks de Mozello.
- No migrar comentarios en la primera version salvo decision explicita.

## Pendientes

- Extraer HTML completo de cada post.
- Descargar imagenes.
- Convertir HTML a bloques.
- Revisar manualmente formato y enlaces.
- Confirmar categorias finales.

# Pbeaux - Opciones de editor

## Decision: editor por bloques visuales

El usuario necesita poder escribir posts y ubicar fotos dentro del texto sin conocimientos tecnicos. La mejor opcion para eso es un editor por bloques.

## Opcion A - Bloques visuales

### Experiencia

El post se arma agregando piezas:

- Titulo
- Bajada
- Parrafo
- Imagen
- Galeria
- Cita
- Separador
- Dos columnas
- Boton/link

Cada bloque se puede mover arriba/abajo y editar de forma aislada.

### Imagenes

Para una imagen, el admin deberia permitir:

- Subir archivo.
- Texto alternativo.
- Caption.
- Alineacion: izquierda, centro, derecha.
- Tamaño: normal, ancho completo, pequeño.

### Ventajas

- Muy amigable para usuario no tecnico.
- Evita HTML roto.
- Facilita mantener el diseño del post.
- Facilita migrar contenido.
- Facilita renderizar por idioma.

### Desventajas

- Lleva mas trabajo inicial que Markdown.
- Hay que elegir o implementar una libreria de bloques.

## Opcion B - Editor visual clasico

### Experiencia

Similar a WordPress/Mozello/Word:

- Negrita
- Italica
- Listas
- Links
- Imagenes
- Alineacion

### Ventajas

- Familiar.
- Rapido de implementar con librerias existentes.

### Desventajas

- Puede generar HTML dificil de controlar.
- Si se pega contenido desde otra web puede traer estilos raros.
- Menos consistente visualmente.

## Opcion C - Markdown + preview

### Experiencia

El usuario escribe Markdown y ve una vista previa.

### Ventajas

- Robusto.
- Simple tecnicamente.
- Facil de guardar y migrar.

### Desventajas

- Menos amigable para usuario no tecnico.
- Insertar imagenes en posiciones especificas es menos intuitivo.

## Decision final

Usar bloques visuales como experiencia principal.

Dejar Markdown solo como posible modo avanzado futuro, no para la primera version.

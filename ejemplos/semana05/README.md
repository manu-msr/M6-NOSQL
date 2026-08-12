[`Conceptos avanzados de bases de datos NoSQL`](../../README.md) > `Semana 05`

# Semana 05: Búsqueda y protección de la información

<div style="text-align: justify;">

Durante esta semana elegiremos la relación adecuada para buscar cadenas y
limitaremos el acceso a la información según responsabilidades explícitas.
Primero contrastaremos igualdad, términos y patrones. Después traduciremos
perfiles a recursos y acciones, y reduciremos la exposición de datos sensibles.

## 1. Objetivo :dart:

- Distinguir coincidencia exacta, término lingüístico y patrón de caracteres.
- Crear y verificar un índice de texto con idioma declarado.
- Buscar términos y frases, y ordenar por relevancia sin sobrerinterpretarla.
- Usar anclas, clases, cuantificadores y sensibilidad a mayúsculas en regex.
- Combinar filtros estructurados y textuales y revisar su plan.
- Separar autenticación de autorización y aplicar privilegio mínimo.
- Relacionar perfiles, acciones permitidas, recursos y pruebas negativas.
- Excluir, enmascarar y minimizar campos sin afirmar anonimato.
- Reconocer los límites del entorno didáctico y de la compatibilidad entre
  motores.

## 2. Sesión 13: Consultas avanzadas de texto :mag:

Al comenzar el Ejemplo 17 actualizarás la copia del repositorio. Los dos
ejemplos usan siete avisos sintéticos para que cada coincidencia pueda revisarse.

---

### <ins>Índice, términos y relevancia</ins>

Crearemos un índice sobre descripciones, buscaremos términos y una frase, y
observaremos la puntuación y el plan sin convertirlos en evidencia semántica.

- [**`EJEMPLO 17`**](ejemplo17/README.md)

---

### <ins>Prefijos, estructuras y categorización</ins>

Contrastaremos regex ancladas y no ancladas, validaremos la forma de códigos y
combinaremos patrón, producto y estado.

- [**`EJEMPLO 18`**](ejemplo18/README.md)
- [**`RETO 09`**](../../retos/semana05/reto09/README.md)

---

## 3. Sesión 14: Seguridad, privacidad y cumplimiento :closed_lock_with_key:

Al comenzar el Ejemplo 19 volverás a actualizar el repositorio. La instancia
local usa datos sintéticos, escucha en loopback y no habilita autenticación; las
definiciones se estudian sin convertirla en una configuración de producción.

---

### <ins>Perfiles, roles y privilegios</ins>

Traduciremos las responsabilidades de análisis, auditoría y administración a
acciones y recursos distintos mediante roles personalizados.

- [**`EJEMPLO 19`**](ejemplo19/README.md)

---

### <ins>Salidas protegidas y vista analítica</ins>

Compararemos exclusión, enmascaramiento y minimización, y crearemos una vista
que no expone los campos identificadores de la fuente.

- [**`EJEMPLO 20`**](ejemplo20/README.md)
- [**`RETO 10`**](../../retos/semana05/reto10/README.md)

---

[`← Semana 04`](../semana04/README.md) | [`Regresar al inicio`](../../README.md)

</div>

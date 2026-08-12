[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../../../ejemplos/semana05/README.md) > `Reto 09`

## Reto 09: Elegir y justificar una estrategia de búsqueda

<div style="text-align: justify;">

### 1. Objetivos :dart:

Elegir una pregunta sobre texto libre o códigos, implementar la relación
correcta mediante `$text` o regex y justificar precisión y rendimiento
observado con casos conocidos.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 07 y los ejemplos 17 y 18.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`reportes_busqueda_reto09` contiene diez reportes sintéticos. Elige una sola
ruta y declara su pregunta antes de escribir la consulta:

1. **Ruta de texto:** localizar reportes abiertos de `Hogar` cuya descripción
   mencione inundación o agua.
2. **Ruta de patrón:** localizar reportes abiertos de `Hogar` cuyo código
   completo tenga la forma `HOG-REGION-NNN`, donde `REGION` contiene tres o
   cuatro mayúsculas y `NNN` tres dígitos.

Las rutas no son dos soluciones intercambiables para la misma relación: una
busca términos analizados y la otra una forma de caracteres.

#### Cargar y reconocer los datos

```bash
cd ~/m6-nosql
pwd
bash retos/semana05/reto09/scripts/cargar_datos.sh
bash setup/conectar.sh
```

En la consola:

```javascript
db.reportes_busqueda_reto09.countDocuments({})
db.reportes_busqueda_reto09.find(
  {},
  { codigo: 1, producto: 1, estado: 1, descripcion: 1 }
).sort({ _id: 1 }).toArray()
db.reportes_busqueda_reto09.getIndexes()
```

Deben existir diez documentos y sólo el índice `_id_` inicial.

#### Paso 1. Definir casos de precisión

Antes de consultar, anota:

- un caso positivo que debe aparecer;
- un caso negativo que debe quedar fuera;
- un caso fronterizo que compruebe idioma, estado, producto, ancla o estructura.

No uses el resultado para redefinir la pregunta después de ejecutarla.

#### Paso 2. Crear el índice pertinente

Para la ruta de texto, crea un único índice `text` sobre `descripcion`, con
nombre e idioma español. Para la ruta de patrón, crea un índice ascendente sobre
`codigo`. Verifica siempre con:

```javascript
db.reportes_busqueda_reto09.getIndexes()
```

#### Paso 3. Construir el filtro

Ambas rutas deben incluir:

```javascript
producto: "Hogar",
estado: "abierto"
```

Agrega `$text` con los términos de la ruta 1 o una regex completamente anclada
para la ruta 2. Ejecuta la consulta con proyección y orden por `_id` para poder
revisar todos los casos. Si proyectas `textScore`, ordena mediante el mismo
metadato en lugar de `_id`.

Resultados de control:

- la ruta de texto produce dos documentos;
- la ruta de patrón produce cuatro documentos.

Si tu resultado difiere, revisa la condición completa antes de continuar.

#### Paso 4. Observar el plan

Conserva el mismo filtro:

```javascript
db.reportes_busqueda_reto09.find(filtro).explain("executionStats")
```

Registra `nReturned`, `totalKeysExamined`, `totalDocsExamined` y la parte
relevante del plan ganador. No compares tiempos entre rutas que responden
preguntas distintas ni generalices desde diez documentos.

#### Conservar la solución

Después de comprobar índice, filtro, resultado y plan, escribe `exit` y crea
copias:

```bash
cp retos/semana05/reto09/plantilla_busqueda.js \
  retos/semana05/reto09/busqueda_reto09.js
cp retos/semana05/reto09/plantilla_respuestas.md \
  retos/semana05/reto09/respuestas_reto09.md
nano retos/semana05/reto09/busqueda_reto09.js
```

Transfiere únicamente las decisiones ya verificadas y ejecuta:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana05/reto09/busqueda_reto09.js
```

#### Producto breve esperado

- `busqueda_reto09.js`, ejecutable con una ruta declarada;
- `respuestas_reto09.md`, con pregunta, estrategia, casos y alcance;
- evidencia del índice, resultados y métricas principales de `explain`.

#### Criterios de revisión

- La pregunta precede a la consulta y distingue término de patrón.
- El índice corresponde con el operador elegido.
- Producto y estado se interpretan junto con la condición textual.
- Los casos positivo, negativo y fronterizo explican la precisión.
- El plan se atribuye a la ejecución observada, no a una escala no probada.
- Un término o patrón no se interpreta como causa, cobertura o validez externa.

#### Compatibilidad

Las soluciones se prueban en MongoDB Community 4.4 o 7.0. En Amazon
DocumentDB deben verificarse por versión los índices y operadores disponibles,
el uso de `hint()` para regex y el plan resultante.

[`Ejemplo 18`](../../../ejemplos/semana05/ejemplo18/README.md) | [`← Semana 05`](../../../ejemplos/semana05/README.md)

</div>

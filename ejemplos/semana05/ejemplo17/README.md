[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../README.md) > `Ejemplo 17`

## Ejemplo 17: Buscar términos mediante un índice de texto

<div style="text-align: justify;">

### 1. Objetivo :dart:

Crear y verificar un índice de texto sobre descripciones sintéticas, buscar
términos y frases mediante `$text`, ordenar por `textScore` y delimitar qué
demuestran los resultados y el plan observado.

### 2. Requisitos :clipboard:

- Usar la terminal integrada de AWS Academy Learner Lab.
- Trabajar desde la raíz `~/m6-nosql`.
- Haber revisado la Nota 07.

### 3. Desarrollo :rocket:

#### Actualizar y cargar

Este es el primer ejemplo de la sesión. Desde Bash:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana05/cargar_datos_semana05.js
bash setup/conectar.sh
```

#### Reconocer los datos y la pregunta

```javascript
db.avisos_texto.countDocuments({})
db.avisos_texto.find(
  {},
  { codigo: 1, producto: 1, descripcion: 1 }
).sort({ _id: 1 }).toArray()
```

La colección contiene siete avisos. La pregunta es si la descripción menciona
un término; no si el campo completo es igual a ese término. Comprueba la
diferencia:

```javascript
db.avisos_texto.find(
  { descripcion: "Daño por granizo en parabrisas y cofre" },
  { descripcion: 1 }
).toArray()

db.avisos_texto.find(
  { descripcion: "granizo" },
  { descripcion: 1 }
).toArray()
```

La primera comparación devuelve `AV-TXT-01`; la segunda no devuelve documentos.

#### Crear y verificar el índice

```javascript
db.avisos_texto.createIndex(
  { descripcion: "text" },
  { name: "descripcion_texto", default_language: "spanish" }
)

db.avisos_texto.getIndexes()
```

Los campos y el idioma son decisiones del índice. En MongoDB sólo puede existir
un índice de texto por colección, aunque ese índice abarque varios campos.

#### Buscar uno o varios términos

```javascript
db.avisos_texto.find(
  { $text: { $search: "granizo" } },
  { descripcion: 1 }
).toArray()
```

El resultado es `AV-TXT-01`. Ahora usa dos términos:

```javascript
db.avisos_texto.find(
  { $text: { $search: "granizo inundación" } },
  { descripcion: 1 }
).toArray()
```

La cadena recupera avisos que contienen alguno de los términos analizados. Los
identificadores esperados son `AV-TXT-01`, `AV-TXT-02` y `AV-TXT-03`; mientras
no se solicite orden, su posición no está garantizada.

#### Exigir una frase

```javascript
db.avisos_texto.find(
  { $text: { $search: "\"impacto de piedra\"" } },
  { descripcion: 1 }
).toArray()
```

La frase conserva orden y proximidad y devuelve únicamente `AV-TXT-06`.

#### Proyectar y ordenar relevancia

```javascript
db.avisos_texto.find(
  { $text: { $search: "granizo inundación" } },
  {
    descripcion: 1,
    relevancia: { $meta: "textScore" }
  }
).sort({ relevancia: { $meta: "textScore" } }).toArray()
```

`textScore` ayuda a ordenar coincidencias dentro de este índice y corpus. No es
una probabilidad de cobertura, fraude, causalidad ni severidad.

#### Observar el plan

```javascript
db.avisos_texto.find(
  { $text: { $search: "inundación" } }
).explain("executionStats")
```

Localiza `nReturned`, `totalKeysExamined`, `totalDocsExamined` y el plan ganador.
Siete documentos permiten comprobar precisión, no demostrar rendimiento a
escala.

#### Recapitulación ejecutable

Después de construir cada instrucción en la consola, sal con `exit` y ejecuta:

```bash
bash ejemplos/semana05/ejemplo17/scripts/ejecutar.sh
```

El archivo `.js` conserva exactamente instrucciones de MongoDB ya explicadas;
no introduce otro lenguaje ni sustituye la construcción razonada en vivo.

### 4. Interpretación :mag:

El índice organiza términos de `descripcion` con análisis en español. `$text`
responde preguntas sobre términos o frases, no sobre subcadenas arbitrarias ni
formas de códigos. Cada escritura sobre el campo indexado también debe mantener
el índice. En Amazon DocumentDB deben verificarse por versión los índices,
operadores y planes; compartir parte de la API no demuestra equivalencia.

### 5. Relación con el Reto 09 :link:

El reto permite elegir una necesidad de texto libre o una necesidad de códigos
y exige justificar precisión, resultado y rendimiento observado.

[`← Semana 05`](../README.md) | [`Ejemplo 18 →`](../ejemplo18/README.md)

</div>

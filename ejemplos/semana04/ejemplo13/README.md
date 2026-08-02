[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../README.md) > `Ejemplo 13`

## Ejemplo 13: Modelar registros periódicos de exposición

<div style="text-align: justify;">

### 1. Objetivo :dart:

Modelar una serie mensual de exposición con una marca de tiempo BSON `Date`,
metadatos estables, mediciones, granularidad explícita e índice compuesto por
serie y periodo.

### 2. Requisitos :clipboard:

- Usar la terminal integrada de AWS Academy Learner Lab.
- Trabajar desde la raíz `~/m6-nosql`.
- Haber revisado la Nota 06.

### 3. Desarrollo :rocket:

#### Actualizar el repositorio

Este es el primer ejemplo de la sesión. Desde Bash:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

Prepara MongoDB y restablece los datos compartidos:

```bash
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana04/cargar_datos_semana04.js
bash setup/conectar.sh
```

#### Reconocer la fuente

La fuente contiene una fecha textual y valores mensuales:

```javascript
db.exposicion_temporal_fuente.findOne()
db.exposicion_temporal_fuente.countDocuments({})
```

La serie queda identificada por `producto` y `region`. El periodo señala el
inicio del mes; `polizasExpuestas` y `sumaAsegurada` son mediciones. La
frecuencia de captura y la granularidad del conjunto son mensuales.

#### Construir un documento temporal

```javascript
var fuente = db.exposicion_temporal_fuente
var muestra = fuente.findOne({ _id: "EXP-FUE-001" })
var periodo = new Date(muestra.periodoTexto)
var periodoClave = muestra.periodoTexto.slice(0, 7)
```

Comprueba el tipo:

```javascript
periodo instanceof Date
periodo
```

Modela una sola observación antes de transformar el conjunto:

```javascript
{
  _id: muestra.producto + "|" + muestra.region + "|" + periodoClave,
  periodo: periodo,
  meta: {
    producto: muestra.producto,
    region: muestra.region
  },
  granularidad: "mensual",
  polizasExpuestas: muestra.polizasExpuestas,
  sumaAsegurada: muestra.sumaAsegurada,
  claveSeriePeriodo: muestra.producto + "|" + muestra.region + "|" + periodoClave
}
```

`meta` conserva atributos que identifican la serie; los valores que cambian en
cada periodo permanecen fuera de ese documento anidado.

#### Transformar las seis observaciones

```javascript
db.exposicion_temporal.drop()

db.exposicion_temporal.insertMany(
  fuente.find({}).toArray().map(function (registro) {
    var fecha = new Date(registro.periodoTexto)
    var claveMes = registro.periodoTexto.slice(0, 7)
    return {
      _id: registro.producto + "|" + registro.region + "|" + claveMes,
      periodo: fecha,
      meta: { producto: registro.producto, region: registro.region },
      granularidad: "mensual",
      polizasExpuestas: registro.polizasExpuestas,
      sumaAsegurada: registro.sumaAsegurada,
      claveSeriePeriodo: registro.producto + "|" + registro.region + "|" + claveMes
    }
  })
)
```

Comprueba cantidad, tipos y un documento:

```javascript
db.exposicion_temporal.countDocuments({})
db.exposicion_temporal.findOne({ _id: "auto|centro|2026-01" })
```

#### Indexar y consultar la serie

```javascript
db.exposicion_temporal.createIndex(
  { "meta.producto": 1, "meta.region": 1, periodo: 1 },
  { name: "serie_periodo" }
)
```

Consulta un intervalo semiabierto, con inicio incluido y fin excluido:

```javascript
var filtro = {
  "meta.producto": "auto",
  "meta.region": "centro",
  periodo: {
    $gte: new Date("2026-01-01T00:00:00Z"),
    $lt: new Date("2026-04-01T00:00:00Z")
  }
}

db.exposicion_temporal.find(
  filtro,
  { periodo: 1, polizasExpuestas: 1, sumaAsegurada: 1 }
).sort({ periodo: 1 }).toArray()
```

El resultado contiene enero, febrero y marzo de `auto` en la región `centro`,
en ese orden. El límite superior no incluye abril.

#### Recapitulación ejecutable

Después de construirlo en la consola, sal con `exit` y ejecuta:

```bash
bash ejemplos/semana04/ejemplo13/scripts/ejecutar.sh
```

El script restablece los datos, repite el modelado y valida los tres periodos.

### 4. Interpretación :mag:

Cada documento representa una observación mensual de una sola combinación de
producto y región. El índice inicia con las igualdades que identifican la serie
y termina con el campo temporal usado en el intervalo y el orden. Esta ruta usa
una colección regular para funcionar en MongoDB Community 4.4 y 7.0. En una
versión compatible podría evaluarse una colección de series temporales nativa
sin cambiar el significado lógico de los campos.

### 5. Relación con el Reto 07 :link:

El reto transfiere la separación entre tiempo, metadatos y medición a lecturas
de riesgo con una frecuencia de captura distinta.

[`← Semana 04`](../README.md) | [`Ejemplo 14 →`](../ejemplo14/README.md)

</div>

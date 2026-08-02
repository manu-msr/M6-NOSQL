[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../../../ejemplos/semana04/README.md) > `Reto 08`

## Reto 08: Construir un pipeline de indicadores temporales

<div style="text-align: justify;">

### 1. Objetivos :dart:

Construir un pipeline mensual que incorpore exposición, calcule indicadores e
identifique máximos y cambios observados con un alcance interpretativo claro.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 06 y los ejemplos 15 y 16.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`siniestros_temporales_reto08` contiene nueve eventos sintéticos y
`exposicion_temporal_reto08` contiene tres denominadores mensuales. Un evento no
está cerrado y otro pertenece a un producto distinto.

Se requiere un pipeline que:

1. seleccione siniestros cerrados de `hogar`, región `centro`, entre enero y
   marzo de 2026;
2. derive el mes en UTC y una clave de serie y periodo;
3. agrupe conteo, total, promedio, mínimo y máximo;
4. una la exposición del mismo producto, región y mes;
5. calcule frecuencia y costo por póliza expuesta;
6. ordene cronológicamente e interprete cambios sin pronosticar.

#### Cargar y comprobar los datos

```bash
cd ~/m6-nosql
pwd
bash retos/semana04/reto08/scripts/cargar_datos.sh
bash setup/conectar.sh
```

En la consola:

```javascript
db.siniestros_temporales_reto08.countDocuments({})
db.exposicion_temporal_reto08.countDocuments({})
db.siniestros_temporales_reto08.getIndexes()
db.exposicion_temporal_reto08.getIndexes()
```

Las cantidades deben ser `9` y `3`.

#### Paso 1. Comprobar la población

Construye primero el filtro y úsalo fuera del pipeline:

```javascript
var filtro = {
  "meta.producto": "hogar",
  "meta.region": "centro",
  estado: "cerrado",
  ocurrioEn: {
    $gte: new Date("2026-01-01T00:00:00Z"),
    $lt: new Date("2026-04-01T00:00:00Z")
  }
}

db.siniestros_temporales_reto08.find(
  filtro,
  { _id: 1, ocurrioEn: 1, montoPagado: 1 }
).sort({ ocurrioEn: 1 }).toArray()
```

Antes de agrupar deben existir siete documentos. Explica por qué quedan fuera
los otros dos.

#### Paso 2. Derivar periodo y clave

Inicia el pipeline con `$match`. Después usa `$dateToString` con formato
`%Y-%m` y zona `UTC`. Concatena producto, región y periodo para producir claves
como `hogar|centro|2026-01`.

Ejecuta el pipeline después de `$addFields` y comprueba las claves antes de
agrupar.

#### Paso 3. Agrupar mensualmente

La unidad de `$group` debe conservar la clave y el periodo. Calcula:

- `siniestros` con `$sum`;
- `montoTotal` con `$sum`;
- `severidadPromedio` con `$avg`;
- `montoMinimo` con `$min`;
- `montoMaximo` con `$max`.

Ejecuta de nuevo. Deben existir tres grupos.

#### Paso 4. Incorporar exposición

Agrega `$lookup` desde `exposicion_temporal_reto08`, relacionando la clave del
grupo con `claveSeriePeriodo`. Después usa `$unwind` y comprueba que cada grupo
tenga una sola exposición.

#### Paso 5. Calcular indicadores

En `$project`, conserva periodo, conteos, montos y exposición. Calcula:

```text
frecuencia = siniestros / polizasExpuestas
costoPorExpuesta = montoTotal / polizasExpuestas
```

Redondea frecuencia a seis decimales y valores monetarios derivados a dos.
Ordena por periodo ascendente y conserva la salida.

#### Conservar la solución en los archivos

Después de comprobar todas las etapas, escribe `exit` y crea copias:

```bash
cp retos/semana04/reto08/plantilla_pipeline.js \
  retos/semana04/reto08/pipeline_reto08.js
cp retos/semana04/reto08/plantilla_respuestas.md \
  retos/semana04/reto08/respuestas_reto08.md
nano retos/semana04/reto08/pipeline_reto08.js
```

Transfiere las etapas ya verificadas y ejecuta:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana04/reto08/pipeline_reto08.js
```

#### Producto breve esperado

- `pipeline_reto08.js`, ejecutable y con tres periodos ordenados;
- `respuestas_reto08.md`, con la tabla y una interpretación breve;
- evidencia de siete seleccionados, tres grupos y sus indicadores.

#### Criterios de revisión

- El filtro conserva exactamente la población indicada.
- La agrupación usa mes UTC y no mezcla series.
- Cada periodo encuentra su denominador correspondiente.
- Frecuencia, severidad y costo por expuesta mantienen unidades distintas.
- La salida incluye mínimo, máximo y orden cronológico.
- La interpretación distingue patrón observado, causalidad y pronóstico.

#### Compatibilidad

El pipeline usa operadores disponibles en MongoDB Community 4.4 y 7.0. Un
traslado a Amazon DocumentDB requiere verificar cada etapa en la versión
objetivo.

[`Ejemplo 16`](../../../ejemplos/semana04/ejemplo16/README.md) | [`← Semana 04`](../../../ejemplos/semana04/README.md)

</div>

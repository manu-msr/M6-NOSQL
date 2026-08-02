[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../../../ejemplos/semana04/README.md) > `Reto 07`

## Reto 07: Diseñar una estructura para mediciones temporales

<div style="text-align: justify;">

### 1. Objetivos :dart:

Transformar lecturas textuales en una serie con marca de tiempo BSON `Date`,
metadatos, medición, granularidad e índice adecuados para una consulta por
intervalo.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 06 y los ejemplos 13 y 14.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`mediciones_riesgo_reto_fuente` contiene ocho lecturas sintéticas de
precipitación obtenidas por dos sensores cada 30 minutos. Las fechas todavía
son texto y los atributos de serie están separados.

Se requiere:

1. convertir `medidoEnTexto` a BSON `Date`;
2. separar la marca temporal, los metadatos estables y la medición;
3. declarar la frecuencia de captura de 30 minutos;
4. crear un índice por sensor, variable y tiempo;
5. consultar una serie dentro de un intervalo semiabierto;
6. explicar la unidad y el alcance de la salida.

#### Cargar y comprobar los datos

Desde Bash:

```bash
cd ~/m6-nosql
pwd
bash retos/semana04/reto07/scripts/cargar_datos.sh
bash setup/conectar.sh
```

En la consola:

```javascript
db.mediciones_riesgo_reto_fuente.countDocuments({})
db.mediciones_riesgo_reto_fuente.find().sort({ _id: 1 }).toArray()
```

La cantidad debe ser `8`. Identifica qué atributos permanecen constantes para
cada sensor y cuál cambia en cada lectura.

#### Paso 1. Probar la conversión temporal

```javascript
var muestra = db.mediciones_riesgo_reto_fuente.findOne({ _id: "MED-RET-01" })
var fecha = new Date(muestra.medidoEnTexto)
fecha
fecha instanceof Date
isNaN(fecha.getTime())
```

La fecha debe ser válida. Construye y revisa un documento de destino antes de
insertar los ocho.

#### Paso 2. Modelar la colección

Crea `mediciones_riesgo_reto` con esta forma lógica:

```javascript
{
  _id: "identificador de la lectura",
  medidoEn: ISODate("marca de tiempo"),
  meta: {
    sensorId: "sensor",
    variable: "variable observada",
    zona: "zona",
    unidad: "unidad"
  },
  granularidadCapturaMinutos: 30,
  valor: 0
}
```

En la consola, elimina sólo el destino y transforma la fuente con `map`:

```javascript
db.mediciones_riesgo_reto.drop()

var documentos = db.mediciones_riesgo_reto_fuente.find({}).toArray()
  .map(function (registro) {
    return {
      /* estructura comprobada con la muestra */
    }
  })

documentos[0]
db.mediciones_riesgo_reto.insertMany(documentos)
db.mediciones_riesgo_reto.countDocuments({ medidoEn: { $type: "date" } })
```

El último conteo debe ser `8`.

#### Paso 3. Indexar una serie temporal

Crea un índice compuesto que atienda las igualdades por `meta.sensorId` y
`meta.variable`, seguidas por el intervalo y orden de `medidoEn`. Compruébalo:

```javascript
db.mediciones_riesgo_reto.getIndexes()
```

#### Paso 4. Consultar el intervalo

Recupera las lecturas de `SEN-RET-01`, variable `precipitacion`, desde las
`00:30` incluidas y antes de las `01:30` del 10 de abril de 2026. Ordena por
`medidoEn` ascendente.

La salida correcta contiene dos documentos. Comprueba sus identificadores
antes de conservar la solución.

#### Conservar la solución en los archivos

Sal con `exit` y crea copias:

```bash
cp retos/semana04/reto07/plantilla_modelado.js \
  retos/semana04/reto07/modelado_reto07.js
cp retos/semana04/reto07/plantilla_respuestas.md \
  retos/semana04/reto07/respuestas_reto07.md
nano retos/semana04/reto07/modelado_reto07.js
```

Transfiere únicamente el modelado y el índice ya comprobados. Ejecuta:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana04/reto07/modelado_reto07.js
```

#### Producto breve esperado

- `modelado_reto07.js`, ejecutable;
- `respuestas_reto07.md`, con decisiones de estructura e interpretación;
- evidencia de ocho fechas BSON `Date`, el índice y las dos lecturas del
  intervalo.

#### Criterios de revisión

- La marca de tiempo es BSON `Date` y tiene un significado declarado.
- Los metadatos estables no se confunden con el valor observado.
- La captura cada 30 minutos queda explícita.
- El índice y el intervalo corresponden con la consulta.
- La salida contiene `MED-RET-02` y `MED-RET-03` en ese orden.
- La interpretación no atribuye riesgo, causalidad ni capacidad predictiva.

#### Compatibilidad

El reto usa una colección regular y funciona en MongoDB Community 4.4 o 7.0.
Una colección de series temporales nativa requiere una versión compatible y no
cambia las decisiones lógicas evaluadas aquí.

[`Ejemplo 14`](../../../ejemplos/semana04/ejemplo14/README.md) | [`← Semana 04`](../../../ejemplos/semana04/README.md)

</div>

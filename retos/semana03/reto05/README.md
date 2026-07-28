[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../../../ejemplos/semana03/README.md) > `Reto 05`

## Reto 05: Transformar coordenadas e indexar bienes

<div style="text-align: justify;">

### 1. Objetivos :dart:

Identificar coordenadas inadmisibles, transformar las fuentes válidas en puntos
GeoJSON y crear el índice geoespacial correspondiente.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05 y las demostraciones de los ejemplos 09 y 10.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde la raíz `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`bienes_coordenadas_reto` contiene siete fuentes sintéticas con longitud y
latitud separadas. Una fuente tiene un valor fuera de los intervalos admitidos.
La colección final `bienes_georreferenciados_reto` debe contener únicamente
geometrías válidas y conservar los atributos temáticos de cada bien.

El producto deberá:

1. identificar y excluir la fuente inválida;
2. conservar una referencia al identificador fuente;
3. representar cada ubicación mediante `Point`;
4. usar el orden longitud--latitud;
5. crear y verificar un índice `2dsphere` sobre `ubicacion`;
6. terminar con seis documentos transformados.

#### Cargar y comprobar los datos

Desde la terminal Bash:

```bash
cd ~/m6-nosql
pwd
bash retos/semana03/reto05/scripts/cargar_datos.sh
```

La salida debe confirmar siete fuentes y una colección de destino vacía.
Después abre la consola:

```bash
bash setup/conectar.sh
```

Comprueba las cantidades y los índices iniciales:

```javascript
db.bienes_coordenadas_reto.countDocuments({})
db.bienes_georreferenciados_reto.countDocuments({})
db.bienes_georreferenciados_reto.getIndexes()
```

Las respuestas deben mostrar `7`, `0` y solamente `_id_`.

#### Paso 1. Localizar la fuente inadmisible

Revisa las fuentes y aplica los intervalos de longitud y latitud:

```javascript
db.bienes_coordenadas_reto.find(
  {},
  { _id: 1, longitud: 1, latitud: 1 }
).sort({ _id: 1 }).toArray()
```

Después expresa la comprobación:

```javascript
db.bienes_coordenadas_reto.find({
  $or: [
    { longitud: { $lt: -180 } },
    { longitud: { $gt: 180 } },
    { latitud: { $lt: -90 } },
    { latitud: { $gt: 90 } }
  ]
}).toArray()
```

Conserva el identificador y la regla incumplida para la interpretación.

#### Paso 2. Construir y comprobar un punto

Selecciona una fuente válida:

```javascript
var bien = db.bienes_coordenadas_reto.findOne({
  _id: "RET-GEO-F-01"
})
```

Construye un documento en la colección de destino. Sustituye los comentarios
por los campos en el orden que exige GeoJSON:

```javascript
db.bienes_georreferenciados_reto.insertOne({
  _id: "RET-GEO-D-01",
  fuenteId: bien._id,
  producto: bien.producto,
  estado: bien.estado,
  sumaAsegurada: bien.sumaAsegurada,
  ubicacion: {
    type: "Point",
    coordinates: [
      /* primer componente */,
      /* segundo componente */
    ]
  }
})
```

Comprueba que `coordinates` contenga dos números y que el punto corresponda con
la fuente. Si la escritura se realizó con un orden incorrecto, elimina sólo el
documento de prueba y vuelve a construirlo:

```javascript
db.bienes_georreferenciados_reto.deleteOne({
  _id: "RET-GEO-D-01"
})
```

#### Paso 3. Transformar las fuentes válidas

En la consola, recupera las fuentes:

```javascript
var fuentes = db.bienes_coordenadas_reto.find({}).sort({ _id: 1 }).toArray()
```

Define una función que compruebe tipos e intervalos y utiliza `filter` para
separar las fuentes válidas. Después aplica con `map` la misma transformación
que ya comprobaste sobre un documento. El resultado debe conservar `_id`,
`fuenteId`, `producto`, `estado`, `sumaAsegurada` y `ubicacion`.

Antes de insertar el conjunto, restablece únicamente la colección de destino:

```javascript
db.bienes_georreferenciados_reto.drop()
```

Inserta los seis documentos transformados y comprueba:

```javascript
db.bienes_georreferenciados_reto.countDocuments({})
db.bienes_georreferenciados_reto.find(
  {},
  { _id: 1, fuenteId: 1, ubicacion: 1 }
).sort({ _id: 1 }).toArray()
```

#### Paso 4. Crear y verificar el índice

Crea un índice con nombre `ubicacion_2dsphere` sobre el campo geoespacial.
Después comprueba:

```javascript
db.bienes_georreferenciados_reto.getIndexes()
```

La salida debe incluir `_id_` y `ubicacion_2dsphere`.

#### Conservar la solución en los archivos

Cuando la transformación funcione en la consola, escribe `exit` y crea copias
editables:

```bash
cp retos/semana03/reto05/plantilla_transformacion.js \
  retos/semana03/reto05/transformacion_reto05.js
cp retos/semana03/reto05/plantilla_respuestas.md \
  retos/semana03/reto05/respuestas_reto05.md
```

Abre la plantilla:

```bash
nano retos/semana03/reto05/transformacion_reto05.js
```

Completa únicamente los dos componentes de `coordinates` y el patrón de
`patronIndice` con las decisiones ya comprobadas. En `nano`, `Ctrl+O` guarda,
`Enter` confirma y `Ctrl+X` cierra.

Ejecuta la recapitulación:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana03/reto05/transformacion_reto05.js
```

Si aparece `ECONNREFUSED` o faltan los datos, ejecuta:

```bash
bash setup/setup.sh
bash retos/semana03/reto05/scripts/cargar_datos.sh
```

#### Producto breve esperado

La entrega contiene:

- `transformacion_reto05.js`, ejecutable;
- `respuestas_reto05.md`, con la interpretación solicitada;
- evidencia donde sean visibles la fuente rechazada, seis puntos y el índice.

No se requiere un reporte extenso ni una imagen de todos los documentos.

#### Criterios de revisión

- Se identifica la fuente fuera de intervalo.
- Los seis puntos usan `type`, `coordinates` y orden longitud--latitud.
- Los atributos temáticos y `fuenteId` se conservan.
- El índice `2dsphere` se crea sobre `ubicacion`.
- La interpretación distingue validez estructural, exactitud y nivel de riesgo.

#### Compatibilidad

El reto se ejecuta y evalúa en MongoDB Community 4.4 o 7.0. Un traslado a
Amazon DocumentDB exige comprobar por separado el índice y las operaciones que
lo utilizarán.

<br/>

[`Ejemplo 10`](../../../ejemplos/semana03/ejemplo10/README.md) | [`Siguiente`](../reto06/README.md)

</div>

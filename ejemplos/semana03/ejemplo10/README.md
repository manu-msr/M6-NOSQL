[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../README.md) > `Ejemplo 10`

## Ejemplo 10: Representar zonas mediante polígonos GeoJSON

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Distinguir una posición, un anillo y un polígono.
- Representar zonas sintéticas mediante objetos GeoJSON de tipo `Polygon`.
- Comprobar que el anillo exterior esté cerrado.
- Crear y verificar un índice `2dsphere` sobre las zonas.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05 y el Ejemplo 09.
- Continuar en la terminal integrada del Learner Lab.
- Conservar la copia del repositorio actualizada al inicio de la sesión.

### 3. Desarrollo :rocket:

#### Contexto del problema

Un punto es suficiente para localizar un bien, pero no conserva la extensión de
una zona de inundación o exposición. Ahora representaremos tres regiones
sintéticas mediante polígonos. El segundo ejemplo amplía el primero: ya no basta
un par de coordenadas; necesitamos un anillo de posiciones y un nivel adicional
de anidamiento.

La geometría delimita el área utilizada por la demostración. No indica por sí
sola cómo se construyó la zona, su probabilidad de ocurrencia ni una categoría
actuarial completa.

#### Preparar la consola

Desde la raíz `~/m6-nosql`, restablece los datos y abre la consola:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/cargar_datos_semana03.js

bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, escribe una instrucción a la vez.

#### Paso 1. Reconocer los vértices de la fuente

```javascript
var fuentes = db.zonas_riesgo_fuente.find({}).sort({ _id: 1 }).toArray()
fuentes[0]
```

`vertices` es un arreglo de posiciones. La primera y la última posición son
iguales para cerrar el contorno.

#### Paso 2. Construir el primer polígono

```javascript
db.zonas_riesgo.drop()
var zona = fuentes[0]
```

Inserta el arreglo de vértices como el anillo exterior:

```javascript
db.zonas_riesgo.insertOne({
  _id: zona._id,
  categoria: zona.categoria,
  vigencia: zona.vigencia,
  geometria: {
    type: "Polygon",
    coordinates: [zona.vertices]
  }
})
```

Comprueba los tres niveles: `coordinates`, el anillo y cada posición.

```javascript
var zonaCentro = db.zonas_riesgo.findOne({ _id: "ZONA-GEO-01" })
var anillo = zonaCentro.geometria.coordinates[0]

({
  posiciones: anillo.length,
  primeraPosicion: anillo[0],
  ultimaPosicion: anillo[anillo.length - 1],
  anilloCerrado:
    anillo[0][0] === anillo[anillo.length - 1][0] &&
    anillo[0][1] === anillo[anillo.length - 1][1]
})
```

La salida indica cinco posiciones y `anilloCerrado: true`.

#### Paso 3. Representar las otras zonas

```javascript
var documentosGeoJSON = fuentes.map(function (elemento) {
  return {
    _id: elemento._id,
    categoria: elemento.categoria,
    vigencia: elemento.vigencia,
    geometria: {
      type: "Polygon",
      coordinates: [elemento.vertices]
    }
  }
})

db.zonas_riesgo.insertMany(documentosGeoJSON.slice(1))
```

Comprueba las tres geometrías:

```javascript
db.zonas_riesgo.find(
  {},
  { _id: 1, categoria: 1, "geometria.type": 1 }
).sort({ _id: 1 }).toArray()
```

#### Paso 4. Crear y verificar el índice

```javascript
db.zonas_riesgo.createIndex(
  { geometria: "2dsphere" },
  { name: "geometria_2dsphere" }
)

db.zonas_riesgo.getIndexes()
```

La lista debe incluir `_id_` y `geometria_2dsphere`. Si un anillo estuviera
abierto o una posición fuera inválida, la construcción podría fallar; el índice
no sustituye la revisión de calidad.

#### Recapitulación en un archivo `.js`

Después de revisar cada nivel, el archivo
[`consultas/representar_poligonos_geojson.js`](consultas/representar_poligonos_geojson.js)
reúne las instrucciones comprobadas. Escribe `exit` y ejecútalo:

```bash
bash ejemplos/semana03/ejemplo10/scripts/ejecutar.sh
```

#### Interpretación

El punto del ejemplo anterior representa una posición. El polígono de este
ejemplo representa una región porque conserva un anillo cerrado. La categoría
y la vigencia siguen siendo atributos necesarios para interpretar esa forma:
la geometría no explica por sí misma el significado de la zona.

#### Relación con el Reto 05

El reto se concentrará en puntos porque permite comprobar con claridad sistema,
orden, intervalos e índice. La comparación con este ejemplo ayuda a reconocer
que cada tipo GeoJSON requiere una estructura de `coordinates` distinta.

#### Compatibilidad

La demostración se ejecuta en MongoDB Community 4.4 o 7.0. La compatibilidad de
sintaxis no garantiza las mismas capacidades ni el mismo diagnóstico en Amazon
DocumentDB; el traslado debe comprobarse en la versión objetivo.

<br/>

[`Anterior`](../ejemplo09/README.md) | [`Reto 05`](../../../retos/semana03/reto05/README.md)

</div>

[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../README.md) > `Ejemplo 09`

## Ejemplo 09: Representar bienes asegurados mediante puntos GeoJSON

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Separar atributos temáticos y geometría.
- Transformar longitud y latitud en un objeto GeoJSON de tipo `Point`.
- Conservar el orden `[longitud, latitud]`.
- Crear y verificar un índice `2dsphere`.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05.
- Continuar en la terminal integrada del Learner Lab.
- Conservar el repositorio y las herramientas preparados en las semanas
  anteriores.

### 3. Desarrollo :rocket:

#### Actualizar el repositorio

Antes del primer ejemplo de la sesión, actualiza la copia utilizada en la clase
anterior. Desde la terminal integrada del Learner Lab, ejecuta una línea a la
vez:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

La actualización fue correcta si aparece `Already up-to-date.` o un resumen de
avance sin errores. `pwd` debe terminar en `/m6-nosql` y `ls` debe mostrar
`datos`, `ejemplos`, `retos` y `setup`.

Si `cd` indica que la carpeta no existe o `git pull` presenta un error,
conserva el mensaje y comunícalo al docente. No vuelvas a clonar el repositorio.

#### Contexto del problema

Se dispone de seis bienes sintéticos. La fuente conserva longitud y latitud
como campos separados, pero las operaciones geoespaciales requieren una
geometría explícita. Transformaremos cada par en un punto GeoJSON sin perder
producto, estado ni suma asegurada.

Una ubicación es una simplificación didáctica: el punto localiza el bien, pero
no representa el contorno de la construcción ni mide por sí mismo exposición o
riesgo.

#### Preparar los datos y abrir la consola

Desde la raíz `~/m6-nosql`, inicia MongoDB, carga los datos de la semana y abre
la consola:

```bash
bash setup/setup.sh

./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/cargar_datos_semana03.js

bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, escribe las instrucciones siguientes
directamente en la consola.

#### Paso 1. Reconocer la fuente

```javascript
var fuentes = db.bienes_geo_fuente.find({}).sort({ _id: 1 }).toArray()
fuentes[0]
```

El primer documento contiene `longitud: -99.142` y `latitud: 19.438`. Los
demás campos describen el bien; las dos coordenadas describen dónde se localiza.

#### Paso 2. Construir el primer punto

Restablece la colección de destino y conserva un documento fuente:

```javascript
db.bienes_geo.drop()
var bien = fuentes[0]
```

Ahora inserta la geometría:

```javascript
db.bienes_geo.insertOne({
  _id: bien._id,
  producto: bien.producto,
  estado: bien.estado,
  sumaAsegurada: bien.sumaAsegurada,
  ubicacion: {
    type: "Point",
    coordinates: [bien.longitud, bien.latitud]
  }
})
```

Comprueba el resultado:

```javascript
db.bienes_geo.findOne({ _id: "BIEN-GEO-01" })
```

`type` declara la geometría y `coordinates` contiene primero la longitud y
después la latitud. Invertirlas cambiaría la ubicación y, en algunos casos,
produciría valores fuera de intervalo.

#### Paso 3. Repetir la misma transformación

Construye un documento por cada fuente:

```javascript
var documentosGeoJSON = fuentes.map(function (elemento) {
  return {
    _id: elemento._id,
    producto: elemento.producto,
    estado: elemento.estado,
    sumaAsegurada: elemento.sumaAsegurada,
    ubicacion: {
      type: "Point",
      coordinates: [elemento.longitud, elemento.latitud]
    }
  }
})
```

El método `map` conserva una transformación ya razonada: por cada documento de
entrada produce un documento de salida. Como el primero ya se insertó, agrega
los cinco restantes:

```javascript
db.bienes_geo.insertMany(documentosGeoJSON.slice(1))
db.bienes_geo.find(
  {},
  { _id: 1, producto: 1, ubicacion: 1 }
).sort({ _id: 1 }).toArray()
```

La salida debe mostrar seis puntos con dos componentes numéricos.

#### Paso 4. Crear y verificar el índice

```javascript
db.bienes_geo.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
)

db.bienes_geo.getIndexes()
```

La lista debe incluir `_id_` y `ubicacion_2dsphere`. El índice no corrige una
geometría mal formada: por eso revisamos estructura, orden e intervalos antes
de crearlo.

#### Recapitulación en un archivo `.js`

Después de construir y comprobar cada paso, el archivo
[`consultas/representar_puntos_geojson.js`](consultas/representar_puntos_geojson.js)
conserva el recorrido completo. No introduce un lenguaje distinto; reúne las
instrucciones de MongoDB ya explicadas.

Escribe `exit` y ejecútalo desde `~/m6-nosql`:

```bash
bash ejemplos/semana03/ejemplo09/scripts/ejecutar.sh
```

#### Interpretación

La geometría responde dónde está el bien; `producto`, `estado` y
`sumaAsegurada` explican qué entidad es. El índice `2dsphere` prepara la ruta de
acceso para consultas espaciales, pero no convierte la ubicación en una medida
de exposición ni garantiza que la fuente sea exacta.

#### Relación con el Reto 05

El reto solicitará reconocer una coordenada inválida, transformar las fuentes
admisibles a puntos GeoJSON y crear el índice correspondiente. La solución se
construirá primero en la consola y sólo después se conservará en una plantilla.

#### Compatibilidad

La demostración se ejecuta sobre MongoDB Community 4.4 o 7.0, según la imagen
del Learner Lab. Antes de trasladarla a Amazon DocumentDB se deben comprobar el
tipo de índice y las operaciones geoespaciales admitidas por la versión
objetivo.

<br/>

[`← Semana 03`](../README.md) | [`Siguiente`](../ejemplo10/README.md)

</div>

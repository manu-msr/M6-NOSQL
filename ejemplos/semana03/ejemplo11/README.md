[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../README.md) > `Ejemplo 11`

## Ejemplo 11: Localizar bienes cercanos a un punto de riesgo

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Construir una consulta de proximidad mediante `$near`.
- Limitar la búsqueda mediante una distancia máxima en metros.
- Combinar la condición espacial con un filtro temático.
- Incorporar la distancia a un pipeline mediante `$geoNear`.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05 y los ejemplos 09 y 10.
- Continuar en la terminal integrada del Learner Lab.
- Conservar el repositorio y las herramientas preparados previamente.

### 3. Desarrollo :rocket:

#### Actualizar el repositorio

Al comenzar la segunda sesión de la semana, actualiza la copia del repositorio:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

`pwd` debe terminar en `/m6-nosql`. Si la carpeta no existe o la actualización
falla, conserva el mensaje y comunícalo al docente; no ejecutes `git clone`
nuevamente.

#### Contexto del problema

Se quiere reconocer qué bienes vigentes se encuentran a no más de cinco
kilómetros de un punto sintético de riesgo. Primero obtendremos una lista
ordenada por cercanía. Después incorporaremos la distancia calculada a un
pipeline para hacerla visible.

La cercanía geoespacial no expresa tiempo de viaje, accesibilidad, causalidad ni
nivel de riesgo. Sólo responde una relación de distancia con la geometría y el
sistema utilizados.

#### Preparar los datos y abrir la consola

Desde la raíz del repositorio:

```bash
bash setup/setup.sh

./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/cargar_datos_semana03.js

bash setup/conectar.sh
```

#### Paso 1. Comprobar la geometría y el índice

```javascript
db.bienes_geo.findOne(
  {},
  { _id: 1, estado: 1, ubicacion: 1 }
)

db.bienes_geo.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
)

db.bienes_geo.getIndexes()
```

`$near` requiere el acceso geoespacial. La lista debe incluir
`ubicacion_2dsphere`.

#### Paso 2. Definir el punto de referencia

```javascript
var puntoRiesgo = {
  type: "Point",
  coordinates: [-99.1332, 19.4326]
}
```

La referencia usa el mismo sistema y orden longitud--latitud que los bienes.

#### Paso 3. Consultar por cercanía

```javascript
var consultaCercanos = {
  estado: "vigente",
  ubicacion: {
    $near: {
      $geometry: puntoRiesgo,
      $maxDistance: 5000
    }
  }
}
```

Ejecuta la consulta:

```javascript
db.bienes_geo.find(
  consultaCercanos,
  { _id: 1, producto: 1, estado: 1, ubicacion: 1 }
).toArray()
```

La salida aparece ordenada desde el bien más cercano. El filtro temático
excluye cualquier documento cuya póliza no esté vigente. La consulta no agrega
un campo con la distancia.

#### Paso 4. Incorporar la distancia al pipeline

`$geoNear` debe ocupar la primera posición:

```javascript
var pipeline = [
  {
    $geoNear: {
      near: puntoRiesgo,
      key: "ubicacion",
      distanceField: "distanciaMetros",
      maxDistance: 5000,
      spherical: true,
      query: { estado: "vigente" }
    }
  }
]

db.bienes_geo.aggregate(pipeline).toArray()
```

Ahora agrega una etapa para conservar sólo los campos necesarios y redondear la
distancia para presentarla:

```javascript
pipeline.push({
  $project: {
    _id: 1,
    producto: 1,
    distanciaMetros: { $round: ["$distanciaMetros", 0] }
  }
})

db.bienes_geo.aggregate(pipeline).toArray()
```

El orden debe coincidir con la consulta anterior y cada documento incluye
`distanciaMetros`.

#### Recapitulación en un archivo `.js`

Después de comprobar ambos recorridos, el archivo
[`consultas/localizar_bienes_cercanos.js`](consultas/localizar_bienes_cercanos.js)
conserva la demostración. Escribe `exit` y ejecuta:

```bash
bash ejemplos/semana03/ejemplo11/scripts/ejecutar.sh
```

#### Interpretación

`$near` es suficiente cuando se requiere seleccionar y ordenar por proximidad.
`$geoNear` se utiliza cuando la distancia debe continuar como parte de un
pipeline. En ambos casos, cinco kilómetros describen un radio geoespacial, no
una decisión operativa completa.

#### Relación con el Reto 06

El reto utilizará otra relación espacial: pertenencia dentro de una zona. La
comparación permitirá elegir el operador de acuerdo con la pregunta y no sólo
porque ambas actividades utilizan coordenadas.

#### Compatibilidad

La demostración se evalúa en MongoDB Community 4.4 o 7.0. Antes de trasladar
`$near`, `$geoNear`, sus opciones o sus conclusiones de rendimiento a Amazon
DocumentDB se debe verificar la versión y el motor objetivo.

<br/>

[`← Semana 03`](../README.md) | [`Siguiente`](../ejemplo12/README.md)

</div>

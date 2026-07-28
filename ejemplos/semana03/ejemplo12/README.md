[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../README.md) > `Ejemplo 12`

## Ejemplo 12: Identificar y agrupar siniestros dentro de una zona

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Seleccionar puntos contenidos en un polígono mediante `$geoWithin`.
- Contrastar pertenencia con intersección mediante `$geoIntersects`.
- Combinar una condición geográfica y una condición temática.
- Agrupar eventos contenidos sin exceder el alcance de la selección.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05 y el Ejemplo 11.
- Continuar en la terminal integrada del Learner Lab.
- Conservar la copia del repositorio actualizada al inicio de la sesión.

### 3. Desarrollo :rocket:

#### Contexto del problema

Se quiere resumir los siniestros cerrados que se encuentran dentro de una zona
sintética de inundación. Primero identificaremos los documentos seleccionados;
después compararemos pertenencia e intersección y, finalmente, agruparemos los
eventos por tipo.

El resumen no constituye una tasa de siniestralidad: describe un subconjunto de
eventos y no incluye una medida de exposición ni demuestra que la zona haya
causado los siniestros.

#### Preparar los datos y abrir la consola

Desde la raíz `~/m6-nosql`:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/cargar_datos_semana03.js

bash setup/conectar.sh
```

#### Paso 1. Preparar los índices y la zona

```javascript
db.siniestros_geo.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
)

db.zonas_riesgo.createIndex(
  { geometria: "2dsphere" },
  { name: "geometria_2dsphere" }
)
```

Recupera la geometría que se utilizará como área de consulta:

```javascript
var zonaCentro = db.zonas_riesgo.findOne({
  _id: "ZONA-GEO-01"
}).geometria
```

Conservar la zona en una variable evita copiar el polígono y mantiene visible
qué documento proporciona sus límites.

#### Paso 2. Seleccionar puntos contenidos

```javascript
var filtroZona = {
  estado: "cerrado",
  ubicacion: {
    $geoWithin: {
      $geometry: zonaCentro
    }
  }
}
```

Comprueba primero los documentos:

```javascript
db.siniestros_geo.find(
  filtroZona,
  { _id: 1, tipoEvento: 1, montoReclamado: 1 }
).sort({ _id: 1 }).toArray()
```

La salida contiene `SIN-GEO-01`, `SIN-GEO-02` y `SIN-GEO-03`. El evento
`SIN-GEO-04` también está dentro de la zona, pero no satisface el filtro
temático `estado: "cerrado"`.

#### Paso 3. Contrastar con intersección

Ahora pregunta qué zonas almacenadas comparten alguna porción del área
evaluada:

```javascript
db.zonas_riesgo.find({
  geometria: {
    $geoIntersects: {
      $geometry: zonaCentro
    }
  }
}, {
  _id: 1,
  categoria: 1
}).sort({ _id: 1 }).toArray()
```

La zona se intersecta consigo misma y con `ZONA-GEO-02`, que se superpone
parcialmente. `$geoIntersects` no exige que una geometría quede contenida por
completo.

#### Paso 4. Llevar la selección a un pipeline

Inicia con la misma condición ya comprobada:

```javascript
var pipeline = [
  {
    $match: filtroZona
  }
]

db.siniestros_geo.aggregate(pipeline).toArray()
```

Después agrega la etapa de resumen:

```javascript
pipeline.push({
  $group: {
    _id: "$tipoEvento",
    eventos: { $sum: 1 },
    montoTotal: { $sum: "$montoReclamado" },
    montoPromedio: { $avg: "$montoReclamado" }
  }
})

db.siniestros_geo.aggregate(pipeline).toArray()
```

Por último, declara un orden determinista:

```javascript
pipeline.push({
  $sort: {
    eventos: -1,
    montoTotal: -1,
    _id: 1
  }
})

db.siniestros_geo.aggregate(pipeline).toArray()
```

El resultado contiene dos grupos: `colision`, con dos eventos y monto total de
125000, e `inundacion`, con un evento y monto total de 120000.

#### Recapitulación en un archivo `.js`

Después de comprobar la selección y cada etapa, el archivo
[`consultas/agrupar_siniestros_en_zona.js`](consultas/agrupar_siniestros_en_zona.js)
conserva el recorrido. Escribe `exit` y ejecuta:

```bash
bash ejemplos/semana03/ejemplo12/scripts/ejecutar.sh
```

#### Interpretación

`$geoWithin` responde qué puntos están contenidos. `$geoIntersects` responde
qué geometrías comparten espacio. La agregación sólo resume los siniestros
cerrados seleccionados por el primer criterio; no describe todos los eventos,
no calcula una tasa y no sustenta causalidad.

#### Relación con el Reto 06

El reto utilizará un conjunto independiente y pedirá construir el mismo flujo
de razonamiento: comprobar la selección espacial, incorporar el filtro
temático, agrupar y declarar el alcance del resultado.

#### Compatibilidad

La demostración se ejecuta sobre MongoDB Community 4.4 o 7.0. Los operadores,
índices, planes y resultados deben verificarse antes de trasladar la solución a
Amazon DocumentDB.

<br/>

[`Anterior`](../ejemplo11/README.md) | [`Reto 06`](../../../retos/semana03/reto06/README.md)

</div>

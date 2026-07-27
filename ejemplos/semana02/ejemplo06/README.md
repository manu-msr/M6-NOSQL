[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 02`](../README.md) > `Ejemplo 06`

## Ejemplo 06: Apoyar filtros y ordenamiento con un índice compuesto

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Relacionar el orden de un índice compuesto con un patrón de consulta.
- Utilizar igualdades sobre `producto` y `estado` antes del campo de ordenamiento.
- Reconocer el uso de un prefijo del índice compuesto.
- Comprobar si el motor necesita una etapa `SORT` independiente.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 03 y el Ejemplo 05.
- Continuar en la terminal integrada del Learner Lab.
- Conservar la copia del repositorio actualizada al inicio de la sesión.

### 3. Desarrollo :rocket:

#### Contexto del problema

Se necesita consultar pólizas de auto vigentes y presentarlas desde la fecha de
inicio más reciente hasta la más antigua. El patrón completo contiene dos
igualdades y un ordenamiento sobre un campo anidado.

La decisión no consiste únicamente en reunir tres campos. Debemos elegir un
orden que corresponda con la forma en que se filtra y se presenta la respuesta,
y después comprobarlo en el plan.

#### Preparar los datos y abrir la consola

Desde la raíz `~/m6-nosql`, restablece la colección base y abre la consola:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, escribe una instrucción a la vez.

#### Paso 1. Leer el patrón completo

Elimina los índices secundarios de otra ejecución y conserva por separado el
filtro y el orden solicitado:

```javascript
db.polizas.dropIndexes()

var filtroPrincipal = {
  producto: "auto",
  estado: "vigente"
}

var ordenPrincipal = {
  "vigencia.inicio": -1
}

db.polizas.find(
  filtroPrincipal,
  { _id: 1, producto: 1, estado: 1, "vigencia.inicio": 1 }
).sort(ordenPrincipal).toArray()
```

La salida contiene tres pólizas: `POL-1005`, `POL-1002` y `POL-1003`, en ese
orden. El ordenamiento forma parte de la consulta que se desea apoyar; no es un
detalle que deba ignorarse al diseñar el índice.

#### Paso 2. Elegir el orden del índice

Las dos igualdades definen primero un bloque de pólizas. Dentro de ese bloque,
la fecha debe quedar disponible en orden descendente:

```javascript
db.polizas.createIndex(
  { producto: 1, estado: 1, "vigencia.inicio": -1 },
  { name: "producto_1_estado_1_inicio_-1" }
)

db.polizas.getIndexes()
```

El índice tiene prefijos continuos: `producto`; después `producto, estado`; y
finalmente los tres campos. No ofrece como prefijo aislado `estado` ni
`vigencia.inicio`.

#### Paso 3. Leer el plan del filtro y el ordenamiento

Solicita la explicación de la consulta completa:

```javascript
var planPrincipal = db.polizas.find(filtroPrincipal)
  .sort(ordenPrincipal)
  .explain("executionStats")

planPrincipal.queryPlanner.winningPlan

({
  nReturned: planPrincipal.executionStats.nReturned,
  totalKeysExamined: planPrincipal.executionStats.totalKeysExamined,
  totalDocsExamined: planPrincipal.executionStats.totalDocsExamined
})
```

El árbol utiliza `IXSCAN` con `producto_1_estado_1_inicio_-1` y no contiene una
etapa `SORT` independiente. En el entorno del curso se examinan tres claves y
tres documentos para devolver tres resultados.

#### Paso 4. Observar el uso de un prefijo

Evalúa ahora una consulta que sólo fija el primer campo del índice:

```javascript
var planPrefijo = db.polizas.find({
  producto: "auto"
}).explain("executionStats")

planPrefijo.queryPlanner.winningPlan

({
  nReturned: planPrefijo.executionStats.nReturned,
  totalKeysExamined: planPrefijo.executionStats.totalKeysExamined,
  totalDocsExamined: planPrefijo.executionStats.totalDocsExamined
})
```

El plan puede utilizar el prefijo `producto` del mismo índice. Esta observación
no significa que cualquier combinación de sus campos sea equivalente: una
consulta que comienza por `estado` describe otro patrón.

#### Recapitulación en un archivo `.js`

El archivo
[`consultas/indice_compuesto_filtro_orden.js`](consultas/indice_compuesto_filtro_orden.js)
conserva las instrucciones y resume ambos planes. Revísalo sólo después de
haber construido y comprobado las consultas en la consola.

Escribe `exit` y, desde `~/m6-nosql`, ejecuta:

```bash
bash ejemplos/semana02/ejemplo06/scripts/ejecutar.sh
```

El archivo `.js` es una recapitulación reproducible de las instrucciones ya
estudiadas; no sustituye la lectura progresiva del patrón, el índice y el plan.

#### Interpretación

El valor del índice proviene de su correspondencia con el filtro y el
ordenamiento. Reutilizar un prefijo puede evitar estructuras redundantes, pero
la decisión debe validarse con las consultas reales y considerar también los
costos de escritura y almacenamiento.

#### Relación con el Reto 03

El reto presenta tres consultas. Deberás valorar si dos de ellas pueden
compartir un índice compuesto mediante su prefijo e incorporar un segundo
índice para un patrón sobre un arreglo.

#### Compatibilidad

La demostración se ejecuta sobre MongoDB Community 4.4 o 7.0, según la imagen
detectada. La selección del índice y la presencia o ausencia de `SORT` deben
comprobarse nuevamente en Amazon DocumentDB.

<br/>

[`Anterior`](../ejemplo05/README.md) | [`Reto 03`](../../../retos/semana02/reto03/README.md)

</div>

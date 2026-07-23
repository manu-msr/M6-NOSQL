[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 04`

## Ejemplo 04: Resumir siniestros por producto y cobertura

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Relacionar siniestros y pólizas mediante `$lookup`.
- Convertir arreglos en documentos individuales mediante `$unwind`.
- Resumir frecuencia y monto mediante `$group`.
- Presentar claves de agrupación con `$addFields` y `$project`.
- Observar el cambio de unidad de análisis a lo largo de un pipeline.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02 y el Ejemplo 03.
- Continuar en la terminal integrada del Learner Lab.
- Haber actualizado el repositorio al comenzar el Ejemplo 03.
- Conservar las herramientas preparadas durante la Sesión 1.

### 3. Desarrollo :rocket:

#### Contexto del problema

Se desea describir cuántas veces aparece cada cobertura afectada y qué monto
reclamado acompaña esas apariciones, separado por producto. `siniestros`
conserva `polizaId` y un arreglo `coberturasAfectadas`; el producto se encuentra
en `polizas_referencias`.

Construiremos el pipeline directamente en la consola. Después de cada etapa
observaremos cómo cambian los documentos antes de incorporar la siguiente. Así
podremos reconocer que un pipeline no es una instrucción indivisible, sino una
secuencia de decisiones sobre los datos.

#### Abrir la consola

La demostración utiliza las colecciones base `siniestros` y
`polizas_referencias`, preparadas al iniciar la sesión. Desde `~/m6-nosql`
ejecuta:

```bash
bash setup/conectar.sh
```

Cuando aparezca el indicador `m6_nosql>` o `>`, escribe las consultas
siguientes una por una.

#### Paso 1. Observar la relación creada por `$lookup`

Antes de procesar todos los documentos, observa una sola póliza relacionada.
El `$match` inicial limita temporalmente la demostración a `SIN-0001`; después,
`$lookup` compara `polizaId` con `_id` y coloca las coincidencias en `poliza`.

```javascript
db.siniestros.aggregate([
  {
    $match: {
      _id: "SIN-0001"
    }
  },
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  }
]).toArray()
```

El documento conserva sus campos originales y ahora contiene `poliza` como un
arreglo con una coincidencia. Aunque los datos de este ejemplo relacionan cada
siniestro con una sola póliza, `$lookup` siempre produce un arreglo porque una
relación podría encontrar cero, una o varias coincidencias.

#### Paso 2. Individualizar la póliza con `$unwind`

Recupera la consulta anterior con la tecla de flecha hacia arriba y agrega un
`$unwind`. Esta etapa reemplaza el arreglo de una coincidencia por el documento
de la póliza relacionada.

```javascript
db.siniestros.aggregate([
  {
    $match: {
      _id: "SIN-0001"
    }
  },
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  },
  {
    $unwind: "$poliza"
  }
]).toArray()
```

Ahora `poliza.producto` puede leerse como un campo anidado. El documento sigue
representando un siniestro porque sólo había una póliza coincidente.

#### Paso 3. Observar el cambio de unidad

Quitaremos el `$match` utilizado para la inspección y procesaremos los diez
siniestros. Un segundo `$unwind` produce un documento intermedio por cada
elemento de `coberturasAfectadas`; `$count` permite observar cuántas unidades
llegan a la siguiente parte del pipeline.

```javascript
db.siniestros.aggregate([
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  },
  {
    $unwind: "$poliza"
  },
  {
    $unwind: "$coberturasAfectadas"
  },
  {
    $count: "documentosIntermedios"
  }
]).toArray()
```

El resultado es `11`. La colección contiene diez siniestros, pero `SIN-0006`
incluye dos coberturas afectadas y, después del segundo `$unwind`, participa
como dos apariciones. La unidad ya no es sólo “un siniestro”, sino “una
aparición de cobertura dentro de un siniestro”.

#### Paso 4. Formar los grupos

Sustituye `$count` por `$group`. La clave `_id` combina producto y cobertura;
los acumuladores cuentan apariciones y resumen el monto que acompaña a cada una.

```javascript
db.siniestros.aggregate([
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  },
  {
    $unwind: "$poliza"
  },
  {
    $unwind: "$coberturasAfectadas"
  },
  {
    $group: {
      _id: {
        producto: "$poliza.producto",
        cobertura: "$coberturasAfectadas"
      },
      apariciones: { $sum: 1 },
      montoReclamadoAsociado: { $sum: "$montoReclamado" },
      montoPromedioPorAparicion: { $avg: "$montoReclamado" }
    }
  }
]).toArray()
```

En esta salida `_id` ya no identifica un siniestro: representa la clave de cada
grupo. Antes de dar formato al resultado, comprueba que se hayan formado cinco
combinaciones distintas de producto y cobertura.

#### Paso 5. Preparar y ordenar la salida

Agrega las últimas etapas. `$addFields` presenta las dos partes de la clave
compuesta como campos; `$project` elimina `_id`; y `$sort` ordena primero por
apariciones y después por monto.

```javascript
db.siniestros.aggregate([
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  },
  {
    $unwind: "$poliza"
  },
  {
    $unwind: "$coberturasAfectadas"
  },
  {
    $group: {
      _id: {
        producto: "$poliza.producto",
        cobertura: "$coberturasAfectadas"
      },
      apariciones: { $sum: 1 },
      montoReclamadoAsociado: { $sum: "$montoReclamado" },
      montoPromedioPorAparicion: { $avg: "$montoReclamado" }
    }
  },
  {
    $addFields: {
      producto: "$_id.producto",
      cobertura: "$_id.cobertura"
    }
  },
  {
    $project: {
      _id: 0,
      producto: 1,
      cobertura: 1,
      apariciones: 1,
      montoReclamadoAsociado: 1,
      montoPromedioPorAparicion: 1
    }
  },
  {
    $sort: {
      apariciones: -1,
      montoReclamadoAsociado: -1,
      producto: 1,
      cobertura: 1
    }
  }
]).toArray()
```

La salida contiene cinco grupos:

| Producto | Cobertura | Apariciones | Monto reclamado asociado |
|---|---:|---:|---:|
| auto | DM | 5 | 196 000 |
| hogar | DAN | 3 | 370 000 |
| hogar | ROB | 1 | 125 000 |
| hogar | INC | 1 | 91 000 |
| auto | RC | 1 | 67 000 |

El orden entre los grupos con una aparición se decide por el monto descendente.

#### Recapitulación en un archivo `.js`

Después de construir y comprobar el pipeline en la consola, el archivo
[`consultas/resumir_por_producto_cobertura.js`](consultas/resumir_por_producto_cobertura.js)
conserva el recorrido completo. El archivo no es una consulta diferente ni un
tema adicional: sólo permite reproducir lo que ya razonamos.

Escribe `exit` para regresar a Bash y ejecútalo desde `~/m6-nosql`:

```bash
bash ejemplos/semana01/ejemplo04/scripts/ejecutar.sh
```

El lanzador restablece los datos y presenta tanto el cambio de unidad como el
resumen final.

#### Interpretación

La frecuencia cuenta apariciones en `coberturasAfectadas`, no pólizas ni
coberturas únicas del portafolio. Además, el monto completo de `SIN-0006` queda
asociado tanto con `DM` como con `RC`. Por ello, sumar los totales de todos los
grupos duplicaría ese monto. Los datos no contienen una asignación del monto por
cobertura y el pipeline no la inventa.

#### Relación con el Reto 02

El reto plantea otra ventana temporal y otro conjunto de datos. Ahí se
construirá y comprobará cada etapa directamente en la consola; sólo al final se
conservará el pipeline verificado como archivo de evidencia.

#### Compatibilidad

La demostración se ejecuta sobre la versión de MongoDB Community seleccionada
por `setup.sh`. Utiliza la forma básica de `$lookup` con `localField` y
`foreignField`, además de `$unwind`, `$group`, `$addFields`, `$project` y
`$sort`; todas estas operaciones están disponibles en 4.4 y 7.0.

<br/>

[`Anterior`](../ejemplo03/README.md) | [`Siguiente`](../../../retos/semana01/reto02/README.md)

</div>

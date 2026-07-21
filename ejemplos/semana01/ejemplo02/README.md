[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 02`

## Ejemplo 02: Repasar consultas sobre documentos

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Reconocer campos simples, documentos anidados y arreglos.
- Repasar filtros de igualdad y comparación mediante `find()`.
- Distinguir el filtro de la proyección de una consulta.
- Observar el uso de ordenamientos y límites.
- Interpretar los resultados en términos de los datos consultados.

### 2. Requisitos :clipboard:

1. Haber seguido el recorrido del Ejemplo 01.
2. Reconocer la estructura general de un documento de `siniestros` en la
   Nota 01.
3. Seguir la demostración realizada por el docente.

> El docente ejecutará las consultas. Concéntrate en identificar qué pregunta
> responde cada una y qué parte de la instrucción produce el resultado.

### 3. Desarrollo :rocket:

#### Contexto del repaso

La colección `siniestros` contiene diez documentos sintéticos con estado,
monto reclamado, fecha de ocurrencia, un documento anidado llamado `aviso` y
dos arreglos: `coberturasAfectadas` y `etiquetas`.

El área de seguimiento necesita localizar casos específicos y mostrar sólo la
información necesaria. En este repaso no transformaremos ni agruparemos los
documentos; utilizaremos consultas directas.

#### Ejecución de la demostración

Desde Bash, el docente ejecutará:

```bash
cd ~/m6-nosql
bash ejemplos/semana01/ejemplo02/scripts/ejecutar.sh
```

El archivo
[`consultas/consultas_siniestros.js`](consultas/consultas_siniestros.js)
organiza cinco consultas y presenta sus resultados en el orden descrito a
continuación.

#### Consulta 1. Reconocer la estructura

`findOne()` recupera `SIN-0003`. La salida permite identificar valores simples,
una fecha BSON, el documento anidado `aviso` y los arreglos del siniestro.

#### Consulta 2. Consultar un campo anidado

La ruta `"aviso.canal"` selecciona los siniestros cuyo aviso fue recibido por
el portal. La notación de punto permite acceder a un campo dentro de otro
documento.

#### Consulta 3. Buscar un valor dentro de un arreglo

La condición `{ etiquetas: "danio_agua" }` recupera los documentos cuyo arreglo
contiene ese valor. No es necesario conocer la posición que ocupa la etiqueta.

#### Consulta 4. Combinar condiciones y proyectar

El filtro conserva siniestros `en_revision`, con monto mayor que 50 000 y aviso
por portal. La proyección limita la respuesta al identificador, la póliza, la
fecha y el monto reclamado.

#### Consulta 5. Ordenar y limitar

La última consulta ordena los siniestros en revisión por monto descendente y
devuelve los tres primeros. Un segundo criterio por identificador hace que el
orden sea estable cuando existen valores iguales.

#### Resultados esperados

- Cinco documentos tienen aviso por portal.
- `SIN-0001` y `SIN-0009` contienen la etiqueta `danio_agua`.
- `SIN-0003` y `SIN-0009` cumplen las tres condiciones de la Consulta 4.
- Los tres primeros montos en revisión corresponden, en orden, a `SIN-0003`,
  `SIN-0007` y `SIN-0009`.

#### Interpretación

El filtro decide qué documentos cumplen la pregunta y la proyección decide qué
campos aparecen en la respuesta. `sort()` organiza el resultado y `limit()`
restringe su tamaño. Una consulta correcta debe relacionar estas operaciones
con la pregunta que se desea responder, no sólo producir una salida sin error.

#### Relación con el Reto 01

Después de preparar tu instancia, completarás una versión breve de la última
consulta. Con ello comprobarás al mismo tiempo la configuración del entorno y
el uso básico de filtro, proyección, ordenamiento y límite.

<br/>

[`Anterior`](../ejemplo01/README.md) | [`Siguiente`](../../../retos/semana01/reto01/README.md)

</div>

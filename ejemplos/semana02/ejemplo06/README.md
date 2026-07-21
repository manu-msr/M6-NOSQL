# Ejemplo 06: apoyar filtros y ordenamiento con un índice compuesto

## 1. Objetivos

- Relacionar el orden de un índice compuesto con un patrón de consulta.
- Utilizar igualdades sobre `producto` y `estado` antes del campo de ordenamiento.
- Reconocer el uso de un prefijo del índice compuesto.
- Comprobar en el plan si el motor necesita una etapa `SORT` independiente.

## 2. Requisitos

- Haber revisado la Nota 03 y el Ejemplo 05.
- Continuar en la terminal integrada del Learner Lab con el repositorio
  `https://github.com/manu-msr/M6-NOSQL` ya clonado.
- Haber ejecutado `bash setup/setup.sh` desde la raíz del repositorio.

## 3. Contexto del problema

Se necesita consultar pólizas de auto vigentes y presentarlas desde la fecha de
inicio más reciente hasta la más antigua. El patrón completo contiene dos
igualdades y un ordenamiento sobre un campo anidado.

## 4. Datos utilizados

La demostración reutiliza la colección base `polizas`. Antes de crear el índice
se eliminan los índices secundarios para que el resultado no dependa de una
ejecución anterior.

## 5. Ejecución de la demostración

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql
pwd
bash ejemplos/semana02/ejemplo06/scripts/ejecutar.sh
```

El lanzador ejecuta
[`consultas/indice_compuesto_filtro_orden.js`](consultas/indice_compuesto_filtro_orden.js)
después de iniciar MongoDB y restablecer los datos.

## 6. Desarrollo guiado

### Paso 1. Leer el patrón completo

El filtro fija `producto: "auto"` y `estado: "vigente"`. Después solicita
`sort({ "vigencia.inicio": -1 })`. El ordenamiento forma parte del patrón, no es
un detalle posterior.

### Paso 2. Elegir el orden del índice

El índice usa `{ producto: 1, estado: 1, "vigencia.inicio": -1 }`. Primero
organiza los bloques definidos por las igualdades y dentro de cada combinación
conserva la fecha en el orden solicitado.

### Paso 3. Leer el plan

El plan utiliza `IXSCAN` con el índice
`producto_1_estado_1_inicio_-1`. No aparece una etapa `SORT` independiente: el
índice ya entrega el orden requerido dentro del bloque filtrado.

### Paso 4. Observar un prefijo

El script ejecuta además una consulta sólo por `producto`. Ese patrón puede usar
el prefijo inicial del mismo índice. Esto no implica que cualquier combinación
de los campos pueda usarlo de la misma forma.

## 7. Resultado esperado

La consulta principal devuelve, en orden:

1. `POL-1005`, inicio 10 de marzo de 2026;
2. `POL-1002`, inicio 1 de febrero de 2026;
3. `POL-1003`, inicio 15 de noviembre de 2025.

En el entorno del curso, el resumen del plan principal contiene `IXSCAN`, tres
claves examinadas, tres documentos examinados y tres documentos devueltos. El
indicador `requiereSort` aparece como `false`.

## 8. Interpretación

El valor del índice proviene de corresponder con el filtro y el ordenamiento. El
prefijo `producto` puede apoyar otra consulta, pero empezar por `estado` o por la
fecha describe patrones distintos. La decisión debe validarse con los planes de
las consultas reales y también considerar el costo de escrituras y
almacenamiento.

## 9. Relación con el Reto 03

El reto presenta tres consultas y solicita proponer una estrategia que reutilice
un índice compuesto cuando sea posible e incorpore un índice multikey cuando el
patrón consulte un arreglo.

## Compatibilidad

El script se ejecuta sobre MongoDB Community 7.0. La selección del índice, el
árbol del plan y la ausencia o presencia de `SORT` deben comprobarse nuevamente
si la consulta se traslada a Amazon DocumentDB.

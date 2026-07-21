[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 04`

## Ejemplo 04: Resumir siniestros por producto y cobertura

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Relacionar siniestros y pólizas mediante `$lookup`.
- Convertir arreglos en documentos individuales mediante `$unwind`.
- Resumir frecuencia y monto mediante `$group`.
- Presentar claves de agrupación con `$addFields` y `$project`.
- Reconocer el cambio de unidad de observación a lo largo de un pipeline.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02 y el Ejemplo 03.
- Continuar en la terminal integrada del Learner Lab con el repositorio
  `https://github.com/manu-msr/M6-NOSQL` ya clonado.
- Haber ejecutado `bash setup/setup.sh` desde la raíz del repositorio.

### 3. Desarrollo :rocket:

#### Contexto del problema

Se desea describir cuántas veces aparece cada cobertura afectada y qué monto
reclamado acompaña esas apariciones, separado por producto. `siniestros`
conserva `polizaId` y un arreglo `coberturasAfectadas`; el producto se encuentra
en `polizas_referencias`.

#### Datos utilizados

La demostración usa las colecciones base `siniestros` y
`polizas_referencias`. Los datos son sintéticos y se restablecen antes de cada
ejecución.

#### Ejecución de la demostración

Desde la terminal Bash del Learner Lab, el ejemplo se ejecuta con estas líneas:

```bash
cd ~/m6-nosql
pwd
bash ejemplos/semana01/ejemplo04/scripts/ejecutar.sh
```

`pwd` debe terminar en `/m6-nosql`. El lanzador ejecuta
[`consultas/resumir_por_producto_cobertura.js`](consultas/resumir_por_producto_cobertura.js)
después de comprobar MongoDB y restablecer los datos.

#### Desarrollo guiado

##### Etapa 1. `$lookup` incorpora la póliza relacionada

`polizaId` en `siniestros` se compara con `_id` en `polizas_referencias`. La
coincidencia se agrega como el arreglo `poliza`. En estos datos cada siniestro
tiene una sola póliza coincidente, pero `$lookup` siempre produce un arreglo.

##### Etapa 2. El primer `$unwind` individualiza la póliza

`$unwind: "$poliza"` convierte el arreglo de una coincidencia en un documento
anidado. El campo `poliza.producto` queda disponible para agrupar.

##### Etapa 3. El segundo `$unwind` cambia la unidad

`$unwind: "$coberturasAfectadas"` produce una fila conceptual por aparición de
cobertura. Los diez siniestros se convierten en once documentos intermedios
porque `SIN-0006` contiene dos coberturas afectadas.

##### Etapa 4. `$group` produce los resúmenes

La clave compuesta contiene producto y cobertura. `$sum: 1` cuenta apariciones;
`$sum` y `$avg` sobre `montoReclamado` resumen el monto asociado con cada
aparición.

##### Etapas 5 a 7. Preparar y ordenar la salida

`$addFields` presenta como campos las dos partes de la clave compuesta;
`$project` elimina `_id`; y `$sort` ordena por frecuencia y monto.

#### Resultado esperado

La salida contiene cinco grupos:

| Producto | Cobertura | Apariciones | Monto reclamado asociado |
|---|---:|---:|---:|
| auto | DM | 5 | 196 000 |
| hogar | DAN | 3 | 370 000 |
| hogar | ROB | 1 | 125 000 |
| hogar | INC | 1 | 91 000 |
| auto | RC | 1 | 67 000 |

El orden entre los grupos con una aparición se decide por el monto descendente.

#### Interpretación

La frecuencia cuenta apariciones en `coberturasAfectadas`, no pólizas ni
coberturas únicas del portafolio. Además, el monto completo de `SIN-0006` queda
asociado tanto con `DM` como con `RC`. Por ello, sumar los totales de todos los
grupos duplicaría ese monto. Los datos no contienen una asignación del monto por
cobertura y el pipeline no la inventa.

#### Relación con el Reto 02

El reto plantea otra ventana temporal y otro conjunto de datos. Ahí se
construye un pipeline y se documenta la interpretación; esta carpeta conserva
únicamente la demostración guiada.

#### Compatibilidad

La demostración se ejecuta sobre la versión de MongoDB Community seleccionada
por `setup.sh`. Utiliza la forma básica de `$lookup` con `localField` y
`foreignField`, además de `$unwind`, `$group`, `$addFields`, `$project` y
`$sort`; todas estas operaciones están disponibles en 4.4 y 7.0.

<br/>

[`Anterior`](../ejemplo03/README.md) | [`Siguiente`](../../../retos/semana01/reto02/README.md)

</div>

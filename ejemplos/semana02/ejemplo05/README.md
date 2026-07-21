# Ejemplo 05: comparar una consulta antes y después de indexar

## 1. Objetivos

- Leer un plan de ejecución con `explain("executionStats")`.
- Distinguir un recorrido `COLLSCAN` de un acceso mediante `IXSCAN`.
- Comparar documentos, claves y resultados antes y después de crear un índice.
- Relacionar el índice con una consulta por estado y fecha de inicio.

## 2. Requisitos

- Haber revisado la Nota 03.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la raíz del repositorio.

## 3. Contexto del problema

Se requieren las pólizas vigentes cuya fecha de inicio sea igual o posterior al
1 de enero de 2026. La demostración ejecuta exactamente la misma consulta antes
y después de crear un índice sobre `estado` y `vigencia.inicio`.

El propósito no es comparar tiempos con seis documentos, sino observar cómo
cambian la estrategia y el trabajo registrado por el motor.

## 4. Datos utilizados

Se reutiliza la colección base `polizas`, con seis documentos sintéticos. El
lanzador restablece los datos y elimina los índices secundarios de la colección
para que la primera medición comience sin la estructura que se evaluará.

## 5. Ejecución de la demostración

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql
pwd
bash ejemplos/semana02/ejemplo05/scripts/ejecutar.sh
```

`pwd` debe mostrar una ruta terminada en `/m6-nosql`. El lanzador
ejecuta
[`consultas/comparar_antes_despues.js`](consultas/comparar_antes_despues.js)
después de iniciar MongoDB y restablecer los datos base.

## 6. Desarrollo guiado

### Paso 1. Fijar el patrón de consulta

El filtro combina una igualdad sobre `estado` y un rango inferior sobre el campo
anidado `vigencia.inicio`. La consulta devuelve tres pólizas.

### Paso 2. Registrar el plan inicial

Sin un índice secundario, el plan muestra `COLLSCAN`. Se examinan los seis
documentos de la colección para devolver tres; no se examinan claves porque no
existe un índice usado por la consulta.

### Paso 3. Crear un índice correspondiente al patrón

El índice `{ estado: 1, "vigencia.inicio": 1 }` organiza primero las pólizas por
estado y después por fecha dentro de cada estado. Su nombre explícito permite
identificarlo en el plan.

### Paso 4. Repetir la misma medición

La segunda ejecución conserva filtro y proyección. El plan incorpora `IXSCAN` y
el nombre `estado_1_vigencia_inicio_1`. La comparación es válida porque sólo
cambió la disponibilidad del índice.

## 7. Resultado esperado

Con la versión de MongoDB Community instalada por `setup.sh` y los datos del
curso, el resumen muestra:

| Indicador | Antes | Después |
|---|---:|---:|
| Acceso | `COLLSCAN` | `IXSCAN` acompañado de `FETCH` |
| Documentos devueltos | 3 | 3 |
| Claves examinadas | 0 | 3 |
| Documentos examinados | 6 | 3 |

Las pólizas devueltas son `POL-1001`, `POL-1002` y `POL-1005`.

## 8. Interpretación

El índice no cambia la respuesta: reduce el conjunto que debe examinarse para
producirla. La colección es deliberadamente pequeña, así que
`executionTimeMillis` no permite afirmar una mejora general de tiempo. La
evidencia útil de esta demostración está en el tipo de acceso y en las cantidades
examinadas.

## 9. Relación con el Reto 03

El reto solicita leer varios planes y proponer una estrategia que atienda más de
un patrón de consulta. La propuesta y su justificación pertenecen al reto, no a
esta demostración.

## Compatibilidad

La demostración se ejecuta sobre MongoDB Community 4.4 o 7.0, según la imagen
detectada. Un plan obtenido aquí no debe presentarse como evidencia de Amazon
DocumentDB: el árbol de etapas y las métricas deben comprobarse en el motor
donde se ejecutará la consulta.

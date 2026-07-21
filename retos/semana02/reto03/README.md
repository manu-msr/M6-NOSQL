# Reto 03: proponer una estrategia de indexación para un portafolio

## 1. Objetivo

Interpretar los planes de tres consultas, proponer una estrategia de indexación
que atienda sus patrones y comprobarla mediante métricas antes y después.

## 2. Requisitos

- Haber revisado la Nota 03 y las demostraciones de los ejemplos 05 y 06.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la raíz del repositorio.

## 3. Situación

`polizas_indexacion_reto` contiene 240 pólizas sintéticas. Se utilizan tres
consultas recurrentes:

1. **Consulta A:** pólizas de auto vigentes, ordenadas por fecha de inicio
   descendente.
2. **Consulta B:** todas las pólizas de auto, sin ordenamiento adicional.
3. **Consulta C:** pólizas que contienen la cobertura `RC` en el arreglo
   `coberturas`.

La estrategia debe usar como máximo dos índices secundarios. Por ello, no se
espera un índice aislado para cada consulta: se debe valorar si un prefijo puede
atender dos patrones y reconocer cuándo se necesita un índice multikey.

## 4. Carga y comprobación de los datos

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql
pwd
bash retos/semana02/reto03/scripts/cargar_datos.sh
```

`pwd` debe terminar en `/m6-nosql`. La salida debe confirmar 240
pólizas y que sólo existe el índice `_id_`.

La cantidad puede comprobarse en la consola:

```bash
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, se ejecuta:

```javascript
db.polizas_indexacion_reto.countDocuments({})
db.polizas_indexacion_reto.getIndexes()
```

Las respuestas deben mostrar `240` y el índice `_id_`. `exit` cierra la consola.

## 5. Analizar los planes iniciales

Desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana02/reto03/analizar_planes_iniciales.js
```

El archivo no se edita. Imprime un resumen con las etapas,
`nReturned`, `totalKeysExamined` y `totalDocsExamined` para las tres consultas.
Esos valores constituyen la medición anterior a la propuesta.

## 6. Preparar los archivos de trabajo

Las siguientes líneas crean copias editables:

```bash
cp retos/semana02/reto03/plantilla_estrategia.js \
  retos/semana02/reto03/estrategia_reto03.js
cp retos/semana02/reto03/plantilla_respuestas.md \
  retos/semana02/reto03/respuestas_reto03.md
```

La estrategia se edita con:

```bash
nano retos/semana02/reto03/estrategia_reto03.js
```

En `nano`, `Ctrl+O` guarda, `Enter` confirma el nombre y `Ctrl+X` cierra. El
mismo procedimiento se usa con `respuestas_reto03.md`. Si aparece
`nano: command not found`, se conserva el mensaje y se comunica al docente antes
de utilizar otro editor.

## 7. Consigna de indexación

En `estrategia_reto03.js` se completan los dos patrones de
`indicesPropuestos`. La solución debe:

1. crear como máximo dos índices secundarios;
2. apoyar el filtro y el ordenamiento de la Consulta A sin una etapa `SORT`
   independiente;
3. reutilizar un prefijo de ese índice para la Consulta B;
4. apoyar la Consulta C mediante un índice sobre los elementos del arreglo;
5. conservar exactamente los resultados de las tres consultas;
6. imprimir los planes posteriores con el mismo resumen que la medición inicial.

Los nombres de los índices ya están definidos en la plantilla. Sólo se completan
los patrones de claves; no se modifican las consultas ni el código de medición.

## 8. Ejecutar y comprobar la estrategia

Desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana02/reto03/estrategia_reto03.js
```

La salida correcta enumera tres planes posteriores y no muestra errores. Las
Consultas A y B deben usar el mismo índice compuesto; la Consulta C debe usar el
segundo índice y mostrar comportamiento multikey en el plan.

Si aparece `ECONNREFUSED` o los datos no coinciden, se repite:

```bash
bash setup/setup.sh
bash retos/semana02/reto03/scripts/cargar_datos.sh
```

## 9. Interpretación requerida

En `respuestas_reto03.md` se documenta:

1. el patrón de cada índice y las consultas que atiende;
2. por qué el orden de los campos del índice compuesto corresponde con la
   Consulta A;
3. qué prefijo usa la Consulta B;
4. por qué el índice de la Consulta C es multikey;
5. la comparación de claves y documentos examinados antes y después;
6. por qué la propuesta no demuestra que esos índices mejoren cualquier
   consulta ni que carezcan de costo.

## 10. Producto breve esperado

La entrega contiene solamente:

- `estrategia_reto03.js`, ejecutable y con dos índices como máximo;
- `respuestas_reto03.md`, con la interpretación solicitada;
- evidencia pertinente donde sean visibles los índices y los tres resúmenes
  posteriores.

No se requiere un reporte extenso ni una captura completa de todos los datos.

## 11. Criterios de revisión

- Los índices corresponden con filtros, ordenamiento y arreglo.
- La Consulta A no necesita una etapa `SORT` independiente.
- La Consulta B usa un prefijo del índice compuesto.
- La Consulta C usa un índice multikey.
- Los resultados no cambian y la comparación usa métricas del plan.
- La interpretación reconoce costos y límites de la evidencia.

## 12. Relación con los ejemplos

- El Ejemplo 05 muestra una comparación controlada antes y después.
- El Ejemplo 06 muestra el orden de un índice compuesto y el uso de un prefijo.
- El reto integra esas decisiones e incorpora un patrón sobre un arreglo.

## Compatibilidad

La evidencia se obtiene en MongoDB Community 4.4 o 7.0, según la imagen
detectada. No se debe atribuir el mismo plan ni las mismas métricas a Amazon
DocumentDB sin ejecutar una comprobación independiente en ese motor.

## Nota docente

La carpeta `solucion_docente` se mantiene fuera de la versión del repositorio
que se distribuya al estudiantado.

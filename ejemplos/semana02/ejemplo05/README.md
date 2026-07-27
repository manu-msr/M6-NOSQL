[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 02`](../README.md) > `Ejemplo 05`

## Ejemplo 05: Comparar una consulta antes y después de indexar

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Leer un plan de ejecución con `explain("executionStats")`.
- Distinguir un recorrido `COLLSCAN` de un acceso mediante `IXSCAN`.
- Comparar documentos, claves y resultados antes y después de crear un índice.
- Relacionar el índice con una consulta por estado y fecha de inicio.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 03.
- Continuar en la terminal integrada del Learner Lab.
- Conservar el repositorio y las herramientas preparados durante la semana 1.

### 3. Desarrollo :rocket:

#### Actualizar el repositorio

Antes de comenzar el primer ejemplo de la sesión, actualiza la copia utilizada
en la clase anterior. Desde la terminal integrada del Learner Lab, ejecuta una
línea a la vez:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

`git pull --ff-only` incorpora los cambios publicados antes de la clase sin
crear otra copia del repositorio. La actualización fue correcta si aparece
`Already up-to-date.` o un resumen de avance sin errores. `pwd` debe terminar
en `/m6-nosql` y `ls` debe mostrar `datos`, `ejemplos`, `retos` y `setup`.

Si `cd` indica que la carpeta no existe o la actualización muestra un error,
conserva el mensaje y comunícalo al docente. No ejecutes `git clone` nuevamente.

#### Contexto del problema

Se requieren las pólizas vigentes cuya fecha de inicio sea igual o posterior al
1 de enero de 2026. Ejecutaremos exactamente la misma consulta antes y después
de crear un índice sobre `estado` y `vigencia.inicio`.

Con seis documentos no tiene sentido competir por milisegundos. La comparación
se concentra en el camino elegido por el motor y en las cantidades examinadas.

#### Preparar los datos y abrir la consola

La demostración reutiliza la colección base `polizas`. Desde la raíz del
repositorio, restablece los datos y abre la consola:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

Cuando aparezca el indicador `m6_nosql>` o `>`, las instrucciones siguientes se
escriben directamente en la consola de MongoDB.

#### Paso 1. Fijar la consulta

Comienza eliminando únicamente los índices secundarios que pudieran quedar de
otra ejecución. Después conserva el filtro en una variable y comprueba la
respuesta:

```javascript
db.polizas.dropIndexes()

var consulta = {
  estado: "vigente",
  "vigencia.inicio": {
    $gte: ISODate("2026-01-01T00:00:00Z")
  }
}

db.polizas.find(
  consulta,
  { _id: 1, estado: 1, "vigencia.inicio": 1 }
).sort({ _id: 1 }).toArray()
```

La consulta devuelve `POL-1001`, `POL-1002` y `POL-1005`. Conviene fijar esta
respuesta antes de medir: el índice podrá cambiar el acceso, pero no los
documentos que satisfacen el filtro.

#### Paso 2. Registrar el plan inicial

Solicita al motor el plan ejecutado y conserva la explicación:

```javascript
var antes = db.polizas.find(consulta).explain("executionStats")

antes.queryPlanner.winningPlan

({
  nReturned: antes.executionStats.nReturned,
  totalKeysExamined: antes.executionStats.totalKeysExamined,
  totalDocsExamined: antes.executionStats.totalDocsExamined
})
```

En el árbol del plan aparece `COLLSCAN`. El resumen indica tres documentos
devueltos, cero claves examinadas y seis documentos examinados. Cero claves no
significa cero trabajo: todavía no existe un índice secundario que recorrer.

#### Paso 3. Crear un índice correspondiente al patrón

La consulta contiene una igualdad y un rango. Crea un índice que organice
primero por estado y después por fecha dentro de cada estado:

```javascript
db.polizas.createIndex(
  { estado: 1, "vigencia.inicio": 1 },
  { name: "estado_1_vigencia_inicio_1" }
)

db.polizas.getIndexes()
```

La salida debe incluir `_id_` y `estado_1_vigencia_inicio_1`. Nombrar el índice
permite reconocerlo sin ambigüedad en el plan.

#### Paso 4. Repetir la misma medición

No cambies `consulta`. Vuelve a solicitar la explicación y recupera las mismas
métricas:

```javascript
var despues = db.polizas.find(consulta).explain("executionStats")

despues.queryPlanner.winningPlan

({
  nReturned: despues.executionStats.nReturned,
  totalKeysExamined: despues.executionStats.totalKeysExamined,
  totalDocsExamined: despues.executionStats.totalDocsExamined
})
```

Ahora el árbol contiene `IXSCAN` con el índice
`estado_1_vigencia_inicio_1`, acompañado de `FETCH`. Se devuelven los mismos
tres documentos, pero se examinan tres claves y tres documentos.

| Indicador | Antes | Después |
|---|---:|---:|
| Acceso | `COLLSCAN` | `IXSCAN` y `FETCH` |
| Documentos devueltos | 3 | 3 |
| Claves examinadas | 0 | 3 |
| Documentos examinados | 6 | 3 |

#### Recapitulación en un archivo `.js`

Una vez razonados y comprobados ambos planes en la consola, el archivo
[`consultas/comparar_antes_despues.js`](consultas/comparar_antes_despues.js)
reúne el recorrido completo y presenta un resumen estable. No introduce otro
lenguaje: conserva las instrucciones de MongoDB que acabamos de ejecutar.

Escribe `exit` para regresar a Bash y ejecútalo desde `~/m6-nosql`:

```bash
bash ejemplos/semana02/ejemplo05/scripts/ejecutar.sh
```

El lanzador restablece los datos, elimina los índices secundarios y reproduce
la comparación. Úsalo para confirmar el recorrido, no para sustituir la
construcción razonada en la consola.

#### Interpretación

El índice no cambia la respuesta; reduce el conjunto que debe examinarse para
producirla. `executionTimeMillis` puede variar y, con una colección didáctica,
no demuestra una mejora general de tiempo. La evidencia pertinente está en el
tipo de acceso y en las cantidades examinadas.

#### Relación con el Reto 03

El reto solicitará leer tres planes y proponer una estrategia que atienda más
de un patrón con un máximo de dos índices. La propuesta pertenece al reto; este
ejemplo sólo establece cómo realizar una comparación controlada.

#### Compatibilidad

La demostración se ejecuta sobre MongoDB Community 4.4 o 7.0, según la imagen
detectada. El árbol de etapas y sus métricas deben comprobarse nuevamente si la
consulta se traslada a Amazon DocumentDB.

<br/>

[`← Semana 02`](../README.md) | [`Siguiente`](../ejemplo06/README.md)

</div>

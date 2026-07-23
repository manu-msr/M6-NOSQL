[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 03`

## Ejemplo 03: Filtrar, proyectar y ordenar siniestros

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Construir un pipeline como una secuencia de transformaciones.
- Filtrar siniestros por fecha y monto mediante `$match`.
- Controlar la forma de la salida mediante `$project`.
- Ordenar el resultado mediante `$sort`.
- Observar qué documentos recibe y produce cada etapa.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02.
- Continuar en la terminal integrada del Learner Lab.
- Conservar el repositorio y las herramientas preparados durante la Sesión 1.

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

`git pull --ff-only` incorpora los cambios que el docente haya publicado antes
de la clase sin crear una nueva copia del repositorio. La actualización fue
correcta si aparece `Already up-to-date.` o un resumen de avance sin errores.
Además, `pwd` debe terminar en `/m6-nosql` y `ls` debe mostrar `datos`,
`ejemplos`, `retos` y `setup`.

Si `cd` indica que la carpeta no existe o `git pull --ff-only` muestra un error,
conserva el mensaje y comunícalo al docente. No crees otra copia por tu cuenta.

#### Contexto del problema

Se necesita una vista breve de los siniestros ocurridos durante 2026 cuyo monto
reclamado sea al menos de 50 000. La salida debe mostrar identificador, póliza,
fecha, monto y estado, y quedar ordenada de mayor a menor monto.

Para comprender cómo se construye la consulta, agregaremos una etapa a la vez y
revisaremos el resultado después de cada decisión. El ejemplo se limita a
recuperar y presentar documentos: todavía no calcula indicadores ni agrupa
resultados.

#### Preparar los datos y abrir la consola

La demostración reutiliza la colección base `siniestros`. Desde la raíz del
repositorio, prepara el servicio y abre la consola:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

`setup.sh` restablece los diez documentos sintéticos de la colección. Cuando
aparezca el indicador `m6_nosql>` o `>`, las instrucciones siguientes se
escriben directamente en la consola de MongoDB.

#### Paso 1. Delimitar el universo con `$match`

Comienza con la condición que decide qué documentos deben continuar. El límite
inferior de la fecha es inclusivo y el superior es exclusivo: se consideran
fechas desde el 1 de enero de 2026 y antes del 1 de enero de 2027. En el mismo
filtro se exige un monto mayor o igual que 50 000.

```javascript
db.siniestros.aggregate([
  {
    $match: {
      fechaOcurrencia: {
        $gte: ISODate("2026-01-01T00:00:00Z"),
        $lt: ISODate("2027-01-01T00:00:00Z")
      },
      montoReclamado: { $gte: 50000 }
    }
  }
]).toArray()
```

La salida conserva todos los campos de los seis documentos que cumplen ambas
condiciones. En este momento conviene comprobar tanto la cantidad como alguna
fecha y algún monto: `$match` reduce el conjunto, pero no modifica la
estructura de cada documento.

#### Paso 2. Dar forma a la salida con `$project`

Recupera la consulta anterior con la tecla de flecha hacia arriba y agrega
`$project` después de `$match`. Esta nueva etapa presenta `_id` con el nombre
`siniestro` y conserva únicamente los campos necesarios para la vista.

```javascript
db.siniestros.aggregate([
  {
    $match: {
      fechaOcurrencia: {
        $gte: ISODate("2026-01-01T00:00:00Z"),
        $lt: ISODate("2027-01-01T00:00:00Z")
      },
      montoReclamado: { $gte: 50000 }
    }
  },
  {
    $project: {
      _id: 0,
      siniestro: "$_id",
      polizaId: 1,
      fechaOcurrencia: 1,
      montoReclamado: 1,
      estado: 1
    }
  }
]).toArray()
```

Siguen apareciendo seis documentos, pero ahora todos tienen una forma breve y
uniforme. `$project` sólo transforma la salida del pipeline; no elimina ni
renombra campos en los documentos almacenados.

#### Paso 3. Establecer un orden con `$sort`

Agrega una tercera etapa. El valor `-1` ordena el monto de mayor a menor y
`siniestro: 1` funciona como desempate ascendente, de modo que el resultado sea
determinista incluso si dos documentos tuvieran el mismo monto.

```javascript
db.siniestros.aggregate([
  {
    $match: {
      fechaOcurrencia: {
        $gte: ISODate("2026-01-01T00:00:00Z"),
        $lt: ISODate("2027-01-01T00:00:00Z")
      },
      montoReclamado: { $gte: 50000 }
    }
  },
  {
    $project: {
      _id: 0,
      siniestro: "$_id",
      polizaId: 1,
      fechaOcurrencia: 1,
      montoReclamado: 1,
      estado: 1
    }
  },
  {
    $sort: {
      montoReclamado: -1,
      siniestro: 1
    }
  }
]).toArray()
```

La salida final contiene seis documentos, en este orden:

1. `SIN-0005`, 210 000;
2. `SIN-0003`, 125 000;
3. `SIN-0001`, 84 000;
4. `SIN-0009`, 76 000;
5. `SIN-0006`, 67 000;
6. `SIN-0008`, 54 000.

`SIN-0007` no aparece porque ocurrió en 2025. Los demás documentos omitidos no
alcanzan el monto mínimo.

#### Recapitulación en un archivo `.js`

Una vez razonadas y comprobadas las tres etapas en la consola, el archivo
[`consultas/filtrar_proyectar_ordenar.js`](consultas/filtrar_proyectar_ordenar.js)
reúne las consultas del ejemplo. No introduce una forma distinta de consultar:
es un registro reproducible de lo que acabamos de construir paso a paso.

Escribe `exit` para regresar a Bash y ejecútalo desde `~/m6-nosql`:

```bash
bash ejemplos/semana01/ejemplo03/scripts/ejecutar.sh
```

El lanzador restablece los datos y reproduce las tres salidas. Úsalo para
confirmar el recorrido completo, no para sustituir la construcción razonada en
la consola.

#### Interpretación

El orden de las etapas expresa el razonamiento: primero se delimita el universo,
después se conserva la información necesaria y al final se organiza la salida.
La lista describe los documentos disponibles; por sí sola no mide severidad,
rentabilidad ni suficiencia de reservas.

#### Relación con el Reto 02

El reto reutiliza la construcción secuencial de un pipeline, pero incorpora
agrupación, arreglos y una relación entre colecciones. Ahí también se probará
cada decisión en la consola antes de conservar el pipeline final.

#### Compatibilidad

La demostración se ejecuta sobre la versión de MongoDB Community seleccionada
por `setup.sh` y utiliza las etapas básicas `$match`, `$project` y `$sort`,
disponibles tanto en 4.4 como en 7.0.

<br/>

[`Anterior`](../../../retos/semana01/reto01/README.md) | [`Siguiente`](../ejemplo04/README.md)

</div>

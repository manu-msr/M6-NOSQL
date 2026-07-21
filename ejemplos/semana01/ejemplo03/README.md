[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 03`

## Ejemplo 03: Filtrar, proyectar y ordenar siniestros

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Leer un pipeline como una secuencia de transformaciones.
- Filtrar siniestros por fecha y monto mediante `$match`.
- Controlar la forma de la salida mediante `$project`.
- Ordenar el resultado mediante `$sort`.
- Interpretar qué documentos recibe y produce cada etapa.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la carpeta `repositorio`.

### 3. Desarrollo :rocket:

#### Contexto del problema

Se necesita una vista breve de los siniestros ocurridos durante 2026 cuyo monto
reclamado sea al menos de 50 000. La salida debe mostrar identificador, póliza,
fecha, monto y estado, y quedar ordenada de mayor a menor monto.

El ejemplo se limita a recuperar y presentar documentos. No calcula indicadores
ni agrupa resultados.

#### Datos utilizados

La demostración reutiliza la colección base `siniestros`. Sus diez documentos
sintéticos fueron cargados por `setup/setup.sh`; no es necesario crear otra
colección.

#### Ejecución de la demostración

Desde la terminal Bash del Learner Lab, las siguientes líneas sitúan la sesión
en la carpeta correcta y ejecutan el ejemplo:

```bash
cd ~/m6-nosql/repositorio
pwd
bash ejemplos/semana01/ejemplo03/scripts/ejecutar.sh
```

`pwd` debe mostrar una ruta terminada en `/m6-nosql/repositorio`. El lanzador
inicia MongoDB si fuera necesario, restablece los datos base y ejecuta
[`consultas/filtrar_proyectar_ordenar.js`](consultas/filtrar_proyectar_ordenar.js).

#### Desarrollo guiado

##### Etapa 1. `$match` reduce el conjunto

El intervalo usa un límite inferior inclusivo y un límite superior exclusivo:
desde el 1 de enero de 2026 hasta antes del 1 de enero de 2027. En el mismo
filtro, `montoReclamado` debe ser mayor o igual que 50 000.

La primera salida conserva todos los campos de los seis documentos que cumplen
ambas condiciones. `$match` decide qué documentos continúan, pero no cambia su
estructura.

##### Etapa 2. `$project` prepara una vista breve

La segunda salida presenta `_id` bajo el nombre `siniestro` y conserva solamente
`polizaId`, `fechaOcurrencia`, `montoReclamado` y `estado`. Los documentos
almacenados no se modifican: cambia la forma que avanza por el pipeline.

##### Etapa 3. `$sort` establece el orden

La tercera salida aplica las tres etapas y ordena primero por
`montoReclamado: -1`. El campo `siniestro: 1` funciona como criterio de desempate
ascendente para que el orden sea determinista.

#### Resultado esperado

La salida final contiene seis documentos, en este orden:

1. `SIN-0005`, 210 000;
2. `SIN-0003`, 125 000;
3. `SIN-0001`, 84 000;
4. `SIN-0009`, 76 000;
5. `SIN-0006`, 67 000;
6. `SIN-0008`, 54 000.

`SIN-0007` no aparece porque ocurrió en 2025. Los demás documentos omitidos no
alcanzan el monto mínimo.

#### Interpretación

El orden de las etapas expresa el razonamiento: primero se delimita el universo,
después se conserva la información necesaria y al final se organiza la salida.
La lista describe los documentos disponibles; por sí sola no mide severidad,
rentabilidad ni suficiencia de reservas.

#### Relación con el Reto 02

El reto reutiliza la lectura secuencial de un pipeline, pero incorpora
agrupación, arreglos y una relación entre colecciones. La actividad para
construir y explicar una solución se encuentra exclusivamente en el reto.

#### Compatibilidad

La demostración se ejecuta sobre MongoDB Community 7.0 y utiliza las etapas
básicas `$match`, `$project` y `$sort`.

<br/>

[`Anterior`](../../../retos/semana01/reto01/README.md) | [`Siguiente`](../ejemplo04/README.md)

</div>

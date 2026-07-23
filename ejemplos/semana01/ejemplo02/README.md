[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 02`

## Ejemplo 02: Repasar consultas sobre documentos

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Reconocer campos simples, documentos anidados y arreglos.
- Construir filtros de igualdad y comparación mediante `find()`.
- Distinguir el filtro de la proyección de una consulta.
- Incorporar ordenamientos y límites de manera progresiva.
- Interpretar los resultados en términos de la pregunta planteada.

### 2. Requisitos :clipboard:

1. Haber seguido el recorrido del Ejemplo 01.
2. Reconocer la estructura general de un documento de `siniestros` en la
   Nota 01.
3. Seguir la demostración realizada por el docente.

> El docente escribirá las consultas en la consola. Concéntrate en identificar
> qué pregunta responde cada parte y cómo cambia la salida al modificarla.

### 3. Desarrollo :rocket:

#### Contexto del repaso

La colección `siniestros` contiene diez documentos sintéticos con estado,
monto reclamado, fecha de ocurrencia, un documento anidado llamado `aviso` y
dos arreglos: `coberturasAfectadas` y `etiquetas`.

El área de seguimiento necesita localizar casos específicos y mostrar sólo la
información necesaria. En este repaso no transformaremos ni agruparemos los
documentos; construiremos consultas directas.

#### Abrir la consola

Desde Bash, el docente escribirá:

```bash
cd ~/m6-nosql
bash setup/conectar.sh
```

Cuando el indicador cambie a `m6_nosql>` o `>`, las consultas se escribirán una
por una.

#### Consulta 1. Reconocer la estructura

La primera pregunta es: **¿cómo está representado el siniestro `SIN-0003`?**

```javascript
db.siniestros.findOne({ _id: "SIN-0003" })
```

`findOne()` recupera un documento. La salida permite identificar valores
simples, una fecha BSON, el documento anidado `aviso` y los arreglos
`coberturasAfectadas` y `etiquetas`.

#### Consulta 2. Consultar un campo anidado

Ahora buscamos los siniestros cuyo aviso fue recibido por el portal. Comienza
solamente con el filtro sobre la ruta `"aviso.canal"`:

```javascript
db.siniestros.find(
  { "aviso.canal": "portal" }
).toArray()
```

La salida permite comprobar que cinco documentos cumplen la condición, aunque
todavía muestra todos sus campos. Recupera la consulta con la tecla de flecha
hacia arriba, añade la proyección y ordena los identificadores:

```javascript
db.siniestros.find(
  { "aviso.canal": "portal" },
  { _id: 1, polizaId: 1, "aviso.canal": 1, "aviso.diasDespues": 1 }
).sort({ _id: 1 }).toArray()
```

El primer documento dentro de `find()` es el filtro; el segundo es la
proyección. La salida contiene cinco documentos. `toArray()` permite observar
el resultado completo en la consola.

#### Consulta 3. Buscar un valor dentro de un arreglo

La siguiente pregunta es: **¿qué siniestros contienen la etiqueta
`danio_agua`?**

```javascript
db.siniestros.find(
  { etiquetas: "danio_agua" },
  { _id: 1, polizaId: 1, etiquetas: 1 }
).sort({ _id: 1 }).toArray()
```

No es necesario indicar la posición del valor dentro del arreglo. La consulta
recupera `SIN-0001` y `SIN-0009`.

#### Consulta 4. Combinar condiciones

Ahora se requieren siniestros que cumplan simultáneamente tres condiciones:
estar `en_revision`, tener un monto mayor que 50 000 y haber sido avisados por
portal. Construye el filtro incorporando y comprobando una condición a la vez:

```javascript
db.siniestros.find(
  { estado: "en_revision" }
).toArray()
```

```javascript
db.siniestros.find(
  {
    estado: "en_revision",
    montoReclamado: { $gt: 50000 }
  }
).toArray()
```

```javascript
db.siniestros.find(
  {
    estado: "en_revision",
    montoReclamado: { $gt: 50000 },
    "aviso.canal": "portal"
  }
).toArray()
```

Las condiciones sobre campos distintos se interpretan conjuntamente. Después
de comprobar que sólo continúan dos documentos, agrega la proyección de los
campos útiles y el orden descendente por monto:

```javascript
db.siniestros.find(
  {
    estado: "en_revision",
    montoReclamado: { $gt: 50000 },
    "aviso.canal": "portal"
  },
  {
    _id: 1,
    polizaId: 1,
    fechaOcurrencia: 1,
    montoReclamado: 1
  }
).sort({ montoReclamado: -1 }).toArray()
```

El resultado contiene `SIN-0003` y `SIN-0009`, ordenados por monto descendente.

#### Consulta 5. Incorporar orden y límite

Partimos de una pregunta más sencilla: **¿cuáles son los tres siniestros en
revisión con mayor monto reclamado?** Primero recupera los documentos en
revisión y presenta sólo los campos necesarios:

```javascript
db.siniestros.find(
  { estado: "en_revision" },
  { _id: 1, polizaId: 1, montoReclamado: 1 }
).toArray()
```

Recupera la instrucción y agrega el orden. El criterio `_id: 1` resuelve los
empates de manera determinista:

```javascript
db.siniestros.find(
  { estado: "en_revision" },
  { _id: 1, polizaId: 1, montoReclamado: 1 }
).sort({ montoReclamado: -1, _id: 1 }).toArray()
```

Finalmente incorpora `limit(3)`:

```javascript
db.siniestros.find(
  { estado: "en_revision" },
  { _id: 1, polizaId: 1, montoReclamado: 1 }
).sort({ montoReclamado: -1, _id: 1 }).limit(3).toArray()
```

Los resultados son `SIN-0003`, `SIN-0007` y `SIN-0009`. La proyección no cambió
qué documentos cumplían el filtro; el orden cambió su secuencia y el límite
redujo la cantidad visible.

Para regresar a Bash se escribe:

```javascript
exit
```

#### Interpretación

El filtro decide qué documentos cumplen la pregunta y la proyección decide qué
campos aparecen. `sort()` establece la secuencia y `limit()` restringe el
tamaño de la respuesta. La consulta se construyó incorporando una decisión a la
vez y comprobando su efecto.

#### Relación con el Reto 01

Después de preparar tu instancia, construirás en la consola una versión breve
de la última consulta y justificarás el orden de sus resultados.

#### Recapitulación en un archivo `.js`

Una vez razonadas las cinco consultas, el archivo
[`consultas_siniestros.js`](consultas/consultas_siniestros.js) las conserva en
el mismo orden. El archivo sirve para repetir la demostración; no sustituye la
construcción paso a paso.

Desde Bash se ejecuta con:

```bash
bash ejemplos/semana01/ejemplo02/scripts/ejecutar.sh
```

<br/>

[`Anterior`](../ejemplo01/README.md) | [`Siguiente`](../../../retos/semana01/reto01/README.md)

</div>

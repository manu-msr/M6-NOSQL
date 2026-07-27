[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 02`](../README.md) > `Ejemplo 07`

## Ejemplo 07: Validar los campos indispensables de un siniestro

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Crear una colección con un validador basado en `$jsonSchema`.
- Diferenciar presencia mediante `required` y tipo mediante `bsonType`.
- Restringir un monto a valores no negativos.
- Comprobar la regla mediante escrituras válidas e inválidas.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 04.
- Continuar en la terminal integrada del Learner Lab.
- Conservar el repositorio y las herramientas preparados anteriormente.

### 3. Desarrollo :rocket:

#### Actualizar el repositorio

Antes de comenzar el primer ejemplo de la sesión, recupera los cambios
publicados desde la terminal integrada:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

La actualización fue correcta si aparece `Already up-to-date.` o un resumen de
avance sin errores. `pwd` debe terminar en `/m6-nosql` y `ls` debe mostrar
`datos`, `ejemplos`, `retos` y `setup`. Si aparece un error, conserva el mensaje
y comunícalo al docente; no vuelvas a clonar el repositorio.

#### Contexto del problema

Un siniestro no puede participar de forma confiable en las consultas
principales si carece del identificador de su póliza, de la fecha de ocurrencia
o del monto reclamado. Traduciremos esas condiciones mínimas a reglas que el
motor pueda comprobar al escribir.

La validación protege requisitos explícitos de estructura y valor. No demuestra
que el evento haya ocurrido ni que la póliza referida exista.

#### Preparar la consola

Desde la raíz del repositorio, comprueba el servicio y abre la consola:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, escribe las instrucciones siguientes
directamente en la consola de MongoDB.

#### Paso 1. Definir la estructura raíz

Trabajaremos con una colección independiente para no modificar los siniestros
base. Elimina una versión anterior y conserva el nombre:

```javascript
var nombreColeccion = "siniestros_validados_ejemplo"
db[nombreColeccion].drop()
```

En el esquema, `bsonType: "object"` describe la raíz del documento. `required`
expresa qué campos deben aparecer:

```javascript
var esquema = {
  bsonType: "object",
  required: [
    "_id",
    "polizaId",
    "fechaOcurrencia",
    "montoReclamado"
  ],
  properties: {}
}
```

Todavía falta describir los valores. Un campo incluido en `required` puede
estar presente y, aun así, tener un tipo incorrecto.

#### Paso 2. Asociar reglas a los campos

Sustituye el objeto vacío de `properties` con estas reglas:

```javascript
esquema.properties = {
  _id: {
    bsonType: "string"
  },
  polizaId: {
    bsonType: "string"
  },
  fechaOcurrencia: {
    bsonType: "date"
  },
  montoReclamado: {
    bsonType: ["int", "long", "double", "decimal"],
    minimum: 0
  },
  estado: {
    bsonType: "string",
    enum: ["en_revision", "cerrado", "rechazado"]
  }
}
```

`estado` es opcional porque no aparece en `required`; si está presente, debe
ser una cadena incluida en el dominio indicado. El monto admite varios tipos
numéricos BSON y no puede ser negativo.

#### Paso 3. Aplicar el esquema a una colección

Crea la colección con nivel `strict` y acción `error`:

```javascript
db.createCollection(nombreColeccion, {
  validator: {
    $jsonSchema: esquema
  },
  validationLevel: "strict",
  validationAction: "error"
})

db.getCollectionInfos({
  name: nombreColeccion
})[0].options
```

La salida debe mostrar el validador, el nivel y la acción. Con esta
configuración, las escrituras evaluadas que incumplen el esquema son rechazadas.

#### Paso 4. Contrastar una escritura válida y tres inválidas

Primero comprueba el caso completo:

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-SIN-01",
  polizaId: "POL-1001",
  fechaOcurrencia: ISODate("2026-07-01T00:00:00Z"),
  montoReclamado: 42000,
  estado: "en_revision"
})
```

La escritura debe ser aceptada. Ahora prueba por separado la ausencia de
`polizaId`, una fecha guardada como cadena y un monto negativo:

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-SIN-02",
  fechaOcurrencia: ISODate("2026-07-02T00:00:00Z"),
  montoReclamado: 18000
})
```

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-SIN-03",
  polizaId: "POL-1002",
  fechaOcurrencia: "2026-07-03",
  montoReclamado: 25000
})
```

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-SIN-04",
  polizaId: "POL-1003",
  fechaOcurrencia: ISODate("2026-07-04T00:00:00Z"),
  montoReclamado: -500
})
```

Las tres escrituras deben ser rechazadas. Termina comprobando el estado de la
colección:

```javascript
db[nombreColeccion].countDocuments({})
db[nombreColeccion].find({}).toArray()
```

El resultado final es un solo documento: `VAL-SIN-01`.

#### Recapitulación en un archivo `.js`

El archivo
[`consultas/validar_siniestro.js`](consultas/validar_siniestro.js) reúne el
esquema y ejecuta las cuatro pruebas con mensajes breves. No sustituye el
recorrido anterior: conserva las instrucciones ya razonadas y comprobadas.

Escribe `exit` y ejecútalo desde `~/m6-nosql`:

```bash
bash ejemplos/semana02/ejemplo07/scripts/ejecutar.sh
```

#### Interpretación

`required` y `properties` cumplen funciones complementarias: una regla exige la
presencia y la otra controla el valor almacenado. La validación protege
condiciones locales del documento; no comprueba la veracidad del siniestro, la
corrección actuarial del monto ni la existencia de la póliza referida.

#### Relación con el Reto 04

El reto combinará campos obligatorios, dominios, arreglos y un documento
anidado opcional. También deberás relacionar cada resultado de prueba con la
regla específica que lo explica.

#### Compatibilidad

La demostración utiliza capacidades disponibles en MongoDB Community 4.4 y
7.0. La compatibilidad del validador y el detalle de los errores deben
comprobarse antes de trasladar la solución a Amazon DocumentDB.

<br/>

[`Reto 03`](../../../retos/semana02/reto03/README.md) | [`Siguiente`](../ejemplo08/README.md)

</div>

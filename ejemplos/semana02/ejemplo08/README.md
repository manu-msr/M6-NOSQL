[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 02`](../README.md) > `Ejemplo 08`

## Ejemplo 08: Validar arreglos y documentos anidados

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Aplicar un subesquema a cada elemento de un arreglo.
- Exigir al menos una cobertura mediante `minItems`.
- Validar un documento anidado cuando un campo opcional está presente.
- Distinguir ausencia válida de estructura presente pero inválida.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 04 y el Ejemplo 07.
- Continuar en la terminal integrada del Learner Lab.
- Conservar la copia del repositorio actualizada al inicio de la sesión.

### 3. Desarrollo :rocket:

#### Contexto del problema

Una póliza debe contener al menos una cobertura. Cada elemento necesita una
clave y un límite no negativo. Algunas pólizas incluyen además una persona
beneficiaria: el campo puede omitirse, pero si aparece debe contener
`personaId` y `parentesco`.

Ampliaremos progresivamente el esquema del ejemplo anterior. Primero
controlaremos el arreglo como conjunto, después cada elemento y, finalmente, la
estructura opcional.

#### Preparar la consola

Desde la raíz `~/m6-nosql`, comprueba el servicio y abre la consola:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, escribe una instrucción a la vez.

#### Paso 1. Validar el arreglo como conjunto

Trabaja con una colección independiente y comienza el esquema:

```javascript
var nombreColeccion = "polizas_validadas_ejemplo"
db[nombreColeccion].drop()

var esquema = {
  bsonType: "object",
  required: ["_id", "producto", "coberturas"],
  properties: {
    _id: {
      bsonType: "string"
    },
    producto: {
      bsonType: "string"
    },
    coberturas: {
      bsonType: "array",
      minItems: 1
    }
  }
}
```

`bsonType: "array"` controla el tipo del campo y `minItems: 1` evita una lista
vacía. Estas reglas todavía no describen la forma de cada cobertura.

#### Paso 2. Validar cada cobertura

Agrega un subesquema mediante `items`:

```javascript
esquema.properties.coberturas.items = {
  bsonType: "object",
  required: ["clave", "limite"],
  properties: {
    clave: {
      bsonType: "string"
    },
    limite: {
      bsonType: ["int", "long", "double", "decimal"],
      minimum: 0
    }
  }
}
```

Todos los elementos del arreglo deben satisfacer este mismo subesquema. Una
cobertura con `clave` pero sin `limite` no es válida.

#### Paso 3. Conservar una variación legítima

Agrega el esquema de `beneficiario` sin incluir ese campo en el `required` de la
póliza:

```javascript
esquema.properties.beneficiario = {
  bsonType: "object",
  required: ["personaId", "parentesco"],
  properties: {
    personaId: {
      bsonType: "string"
    },
    parentesco: {
      bsonType: "string"
    }
  }
}
```

La ausencia de `beneficiario` es válida. Si el campo aparece, entonces su valor
debe ser un objeto completo de acuerdo con el subesquema.

#### Paso 4. Aplicar el esquema

Crea la colección y comprueba la configuración:

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

#### Paso 5. Contrastar casos representativos

Primero inserta una póliza sin el campo opcional y otra con un beneficiario
completo:

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-POL-01",
  producto: "auto",
  coberturas: [
    { clave: "DM", limite: 450000 },
    { clave: "RC", limite: 3000000 }
  ]
})
```

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-POL-02",
  producto: "vida",
  coberturas: [
    { clave: "FAL", limite: 1200000 }
  ],
  beneficiario: {
    personaId: "PER-SINT-021",
    parentesco: "conyuge"
  }
})
```

Ambas escrituras deben aceptarse. Contrasta ahora tres incumplimientos:

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-POL-03",
  producto: "hogar",
  coberturas: []
})
```

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-POL-04",
  producto: "auto",
  coberturas: [
    { clave: "DM" }
  ]
})
```

```javascript
db[nombreColeccion].insertOne({
  _id: "VAL-POL-05",
  producto: "vida",
  coberturas: [
    { clave: "FAL", limite: 900000 }
  ],
  beneficiario: {
    personaId: "PER-SINT-022"
  }
})
```

El arreglo vacío, la cobertura sin límite y el beneficiario incompleto deben
ser rechazados. Comprueba el resultado:

```javascript
db[nombreColeccion].countDocuments({})
db[nombreColeccion].find({}).sort({ _id: 1 }).toArray()
```

La colección termina con `VAL-POL-01` y `VAL-POL-02`.

#### Recapitulación en un archivo `.js`

El archivo
[`consultas/validar_arreglos_anidados.js`](consultas/validar_arreglos_anidados.js)
reúne el esquema completo y ejecuta las cinco pruebas con mensajes breves.
Revísalo después de construir cada parte en la consola.

Escribe `exit` y, desde `~/m6-nosql`, ejecuta:

```bash
bash ejemplos/semana02/ejemplo08/scripts/ejecutar.sh
```

#### Interpretación

La regla del arreglo se aplica a cada elemento, no sólo al primero. La
opcionalidad se decide en el nivel de la póliza: omitir `beneficiario` es
válido, pero incluirlo activa las reglas de su subesquema. El validador protege
forma y restricciones locales; no comprueba suficiencia de coberturas ni
identidades reales.

#### Relación con el Reto 04

El reto trasladará estas decisiones a documentos de siniestros. Deberás
construir el validador, ejecutar casos positivos y negativos e interpretar cada
resultado.

#### Compatibilidad

El ejemplo utiliza capacidades disponibles en MongoDB Community 4.4 y 7.0. El
comportamiento del validador debe verificarse por separado antes de trasladar
la solución a Amazon DocumentDB.

<br/>

[`Anterior`](../ejemplo07/README.md) | [`Reto 04`](../../../retos/semana02/reto04/README.md)

</div>

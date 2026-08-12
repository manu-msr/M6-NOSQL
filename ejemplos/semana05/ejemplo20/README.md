[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../README.md) > `Ejemplo 20`

## Ejemplo 20: Reducir la exposición de datos sensibles

<div style="text-align: justify;">

### 1. Objetivo :dart:

Identificar campos según su finalidad, comparar exclusión y enmascaramiento, y
crear una vista analítica minimizada, declarando por qué estas transformaciones
no bastan para afirmar anonimato ni seguridad completa.

### 2. Requisitos :clipboard:

- Haber actualizado el repositorio al comenzar el Ejemplo 19.
- Mantener MongoDB activo y los datos de la semana 5 cargados.
- Continuar en `~/m6-nosql`.

### 3. Desarrollo :rocket:

Abre la consola:

```bash
bash setup/conectar.sh
```

#### Reconocer y clasificar un documento

```javascript
db.casos_protegidos.findOne({ _id: "CAS-SINT-001" })
```

- `producto`, `estado` y periodo son variables operativas.
- `titular`, `polizaId` y contacto son identificadores o datos de contacto.
- `montoReclamado` es información financiera cuyo acceso depende de la función.
- Una contraseña, token o clave no debe aparecer en los datos ni evidencias.

La clasificación depende del propósito y también de combinaciones: fecha,
entidad y código postal pueden aumentar el riesgo de reidentificación.

#### Excluir campos de una consulta

```javascript
db.casos_protegidos.find(
  { estado: "abierto" },
  { titular: 0, polizaId: 0, descripcion: 0 }
).sort({ ocurridoEn: 1 }).toArray()
```

La salida contiene dos casos sin esos campos. Esta proyección reduce lo que
devuelve una consulta, pero un usuario con acceso a la fuente podría formular
otra. Proyección no equivale a autorización.

#### Enmascarar una salida

```javascript
db.casos_protegidos.aggregate([
  {
    $project: {
      producto: 1,
      estado: 1,
      correoEnmascarado: "[correo protegido]",
      telefonoEnmascarado: {
        $concat: [
          "******",
          { $substrCP: ["$titular.telefono", 6, 4] }
        ]
      }
    }
  },
  { $sort: { _id: 1 } }
]).toArray()
```

Para `CAS-SINT-001` aparece `******0001`. El original sigue almacenado y la
salida revela cuatro caracteres, por lo que se llama enmascarada, no anónima.

#### Crear una vista minimizada

Restablecer los datos elimina cualquier vista anterior. Créala de nuevo con la
granularidad necesaria para análisis:

```javascript
db.createView(
  "casos_analitica",
  "casos_protegidos",
  [
    {
      $project: {
        _id: 0,
        producto: 1,
        estado: 1,
        ocurridoEn: 1,
        montoReclamado: 1,
        entidad: "$ubicacion.entidad",
        zonaPostal: {
          $concat: [
            { $substrCP: ["$ubicacion.codigoPostal", 0, 2] },
            "***"
          ]
        }
      }
    }
  ]
)

db.casos_analitica.find({}).sort({ ocurridoEn: 1 }).toArray()
```

La vista omite el identificador del caso, la póliza, la descripción, el titular
y la ubicación exacta. El control de campo depende además de conceder al rol de
análisis acceso a la vista y no a `casos_protegidos`.

#### Comprobar los campos

```javascript
db.casos_analitica.find({
  $or: [
    { titular: { $exists: true } },
    { polizaId: { $exists: true } },
    { descripcion: { $exists: true } },
    { ubicacion: { $exists: true } }
  ]
}).toArray()
```

El resultado debe estar vacío.

#### Recapitulación ejecutable

```bash
exit
bash ejemplos/semana05/ejemplo20/scripts/ejecutar.sh
```

### 4. Interpretación :mag:

Exclusión, enmascaramiento y minimización protegen fronteras distintas. Ninguna
operación aislada garantiza anonimización: habría que evaluar el conjunto, las
combinaciones poco frecuentes y los datos externos disponibles. La vista
reduce exposición sólo si sus permisos impiden consultar la fuente. Cifrado,
credenciales, registros, conservación y respaldos requieren controles propios.

### 5. Relación con el Reto 10 :link:

El reto integra necesidad, acceso, dato protegido, vista y prueba observable en
una matriz breve sobre otro conjunto sintético.

[`Ejemplo 19`](../ejemplo19/README.md) | [`Reto 10 →`](../../../retos/semana05/reto10/README.md)

</div>

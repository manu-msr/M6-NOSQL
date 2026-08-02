[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../README.md) > `Ejemplo 14`

## Ejemplo 14: Modelar un historial como eventos temporales

<div style="text-align: justify;">

### 1. Objetivo :dart:

Distinguir observaciones periódicas de eventos irregulares y recuperar el
historial de una póliza mediante tiempo de ocurrencia, intervalo semiabierto,
orden cronológico e índice compuesto.

### 2. Requisitos :clipboard:

- Haber actualizado el repositorio al comenzar el Ejemplo 13.
- Mantener MongoDB activo y los datos de la semana 4 cargados.
- Continuar en `~/m6-nosql`.

### 3. Desarrollo :rocket:

Abre la consola si es necesario:

```bash
bash setup/conectar.sh
```

#### Reconocer un evento

```javascript
db.movimientos_temporales.countDocuments({})
db.movimientos_temporales.findOne({ _id: "MOV-TEM-004" })
```

`ocurrioEn` responde cuándo sucedió el evento. `registradoEn` responde cuándo
ingresó al sistema. No son intercambiables: una demora de registro no cambia el
momento del evento de negocio.

La combinación `meta.polizaId` y `meta.tipoEvento` describe la serie y el tipo
de movimiento; `monto` es el valor del evento.

#### Revisar el historial completo

```javascript
db.movimientos_temporales.find(
  { "meta.polizaId": "POL-TEM-001" },
  { ocurrioEn: 1, registradoEn: 1, "meta.tipoEvento": 1, monto: 1 }
).sort({ ocurrioEn: 1 }).toArray()
```

Los eventos no tienen separación constante. A diferencia de la exposición
mensual, aparecen cuando ocurre una emisión, un pago, un ajuste o un aviso.

#### Crear el índice

```javascript
db.movimientos_temporales.createIndex(
  { "meta.polizaId": 1, ocurrioEn: 1 },
  { name: "poliza_ocurrencia" }
)
```

La igualdad por póliza ocupa el prefijo y el tiempo atiende el intervalo y el
orden.

#### Consultar febrero

```javascript
var filtro = {
  "meta.polizaId": "POL-TEM-001",
  ocurrioEn: {
    $gte: new Date("2026-02-01T00:00:00Z"),
    $lt: new Date("2026-03-01T00:00:00Z")
  }
}

db.movimientos_temporales.find(
  filtro,
  {
    ocurrioEn: 1,
    registradoEn: 1,
    "meta.tipoEvento": 1,
    monto: 1,
    moneda: 1
  }
).sort({ ocurrioEn: 1 }).toArray()
```

El resultado esperado es `MOV-TEM-003`, seguido por `MOV-TEM-004`. Un evento
ocurrido exactamente el 1 de marzo quedaría fuera por el operador `$lt`.

Comprueba el plan:

```javascript
db.movimientos_temporales.find(filtro)
  .sort({ ocurrioEn: 1 })
  .explain("executionStats")
```

#### Recapitulación ejecutable

```bash
exit
bash ejemplos/semana04/ejemplo14/scripts/ejecutar.sh
```

### 4. Interpretación :mag:

La unidad es un movimiento individual, no un resumen mensual. Consultar por
`ocurrioEn` reconstruye la secuencia de negocio; consultar por `registradoEn`
respondería una pregunta operativa diferente. El intervalo semiabierto permite
encadenar periodos sin duplicar los eventos que caen en la frontera.

### 5. Relación con el Reto 07 :link:

El reto exige elegir una marca de tiempo, separar metadatos y medición, declarar
la frecuencia de captura e indexar una serie diferente.

[`Ejemplo 13`](../ejemplo13/README.md) | [`Reto 07 →`](../../../retos/semana04/reto07/README.md)

</div>

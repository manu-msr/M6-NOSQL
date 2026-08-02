[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../README.md) > `Ejemplo 16`

## Ejemplo 16: Identificar máximos, variaciones y tendencias

<div style="text-align: justify;">

### 1. Objetivo :dart:

Resumir una serie mensual con mínimo y máximo, calcular variaciones entre meses
consecutivos e interpretar el patrón observado sin extrapolarlo como pronóstico.

### 2. Requisitos :clipboard:

- Haber actualizado el repositorio al comenzar el Ejemplo 15.
- Mantener cargados los datos de la semana 4.
- Continuar en `~/m6-nosql`.

### 3. Desarrollo :rocket:

Abre la consola:

```bash
bash setup/conectar.sh
```

#### Paso 1. Seleccionar una serie comparable

```javascript
var pipeline = [
  {
    $match: {
      "meta.producto": "auto",
      "meta.region": "centro",
      estado: "cerrado",
      ocurrioEn: {
        $gte: new Date("2026-01-01T00:00:00Z"),
        $lt: new Date("2026-04-01T00:00:00Z")
      }
    }
  }
]
```

El producto, la región, el estado y el intervalo se mantienen constantes para
que los grupos mensuales describan la misma población definida.

#### Paso 2. Agrupar por mes

```javascript
pipeline.push({
  $group: {
    _id: {
      $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" }
    },
    siniestros: { $sum: 1 },
    montoTotal: { $sum: "$montoPagado" },
    montoPromedio: { $avg: "$montoPagado" },
    montoMinimo: { $min: "$montoPagado" },
    montoMaximo: { $max: "$montoPagado" }
  }
})
pipeline.push({ $sort: { _id: 1 } })

var resumen = db.siniestros_temporales.aggregate(pipeline).toArray()
resumen
```

La salida ordenada es:

| Mes | Siniestros | Total | Promedio | Mínimo | Máximo |
|---|---:|---:|---:|---:|---:|
| 2026-01 | 3 | 150000 | 50000 | 40000 | 60000 |
| 2026-02 | 2 | 75000 | 37500 | 30000 | 45000 |
| 2026-03 | 3 | 180000 | 60000 | 50000 | 70000 |

#### Paso 3. Comparar meses consecutivos

Con el resumen ya ordenado, calcula la diferencia absoluta y el porcentaje
respecto del mes anterior:

```javascript
var variaciones = []
for (var i = 1; i < resumen.length; i += 1) {
  var anterior = resumen[i - 1]
  var actual = resumen[i]
  var diferencia = actual.montoTotal - anterior.montoTotal
  variaciones.push({
    desde: anterior._id,
    hasta: actual._id,
    cambioAbsoluto: diferencia,
    cambioRelativo: Math.round((diferencia / anterior.montoTotal) * 10000) / 100
  })
}
variaciones
```

De enero a febrero el total cambia `-75000` (`-50%`). De febrero a marzo
cambia `105000` (`140%`). El porcentaje usa el mes anterior como base.

#### Paso 4. Localizar el máximo mensual

```javascript
var maximoMensual = resumen.reduce(function (maximo, periodo) {
  return periodo.montoTotal > maximo.montoTotal ? periodo : maximo
}, resumen[0])

maximoMensual
```

Marzo tiene el mayor monto total (`180000`) y también el mayor siniestro
individual del resumen (`70000`). Son dos máximos con unidades distintas.

#### Recapitulación ejecutable

```bash
exit
bash ejemplos/semana04/ejemplo16/scripts/ejecutar.sh
```

### 4. Interpretación :mag:

La secuencia del monto total baja y después sube, por lo que no es monótona en
los tres meses observados. Llamarla "patrón observado" delimita el alcance: tres
periodos no bastan para pronosticar el siguiente ni para atribuir causas. Los
totales tampoco deben confundirse con frecuencia, porque el denominador no
aparece en este resumen.

### 5. Relación con el Reto 08 :link:

El reto integra agrupación, exposición, indicadores y comparación temporal en
una segunda serie sintética.

[`Ejemplo 15`](../ejemplo15/README.md) | [`Reto 08 →`](../../../retos/semana04/reto08/README.md)

</div>

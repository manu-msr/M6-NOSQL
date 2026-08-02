[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 04`](../README.md) > `Ejemplo 15`

## Ejemplo 15: Calcular frecuencia y severidad por periodo

<div style="text-align: justify;">

### 1. Objetivo :dart:

Construir progresivamente un pipeline que agrupe siniestros por mes, incorpore
la exposición correspondiente y calcule frecuencia, severidad promedio y costo
por póliza expuesta con unidades explícitas.

### 2. Requisitos :clipboard:

- Usar la terminal integrada de AWS Academy Learner Lab.
- Trabajar desde `~/m6-nosql`.
- Haber revisado la Nota 06 y los ejemplos 13 y 14.

### 3. Desarrollo :rocket:

#### Actualizar y cargar

Este es el primer ejemplo de la sesión:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana04/cargar_datos_semana04.js
bash setup/conectar.sh
```

#### Paso 1. Delimitar población e intervalo

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

db.siniestros_temporales.aggregate(pipeline).toArray()
```

La etapa conserva ocho siniestros. Excluye uno en revisión y uno de producto
`vida`.

#### Paso 2. Derivar el periodo y una clave de unión

```javascript
pipeline.push({
  $addFields: {
    periodo: {
      $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" }
    },
    claveSeriePeriodo: {
      $concat: [
        "$meta.producto", "|", "$meta.region", "|",
        { $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" } }
      ]
    }
  }
})
```

Ejecuta de nuevo y comprueba que cada evento tenga un mes y una clave que
coincida con su documento de exposición.

#### Paso 3. Agrupar siniestros

```javascript
pipeline.push({
  $group: {
    _id: { clave: "$claveSeriePeriodo", periodo: "$periodo" },
    siniestros: { $sum: 1 },
    montoTotal: { $sum: "$montoPagado" },
    severidadPromedio: { $avg: "$montoPagado" }
  }
})

db.siniestros_temporales.aggregate(pipeline).toArray()
```

Ahora la unidad es un mes de la serie `auto|centro`. La severidad promedio es
monto por siniestro cerrado; todavía no existe una frecuencia.

#### Paso 4. Incorporar la exposición

```javascript
pipeline.push({
  $lookup: {
    from: "exposicion_temporal",
    localField: "_id.clave",
    foreignField: "claveSeriePeriodo",
    as: "exposicion"
  }
})
pipeline.push({ $unwind: "$exposicion" })
```

Comprueba que cada mes tenga una sola coincidencia. Sin un documento de
exposición, ese periodo no debe presentarse como una frecuencia calculada.

#### Paso 5. Calcular y presentar indicadores

```javascript
pipeline.push({
  $project: {
    _id: 0,
    periodo: "$_id.periodo",
    siniestros: 1,
    polizasExpuestas: "$exposicion.polizasExpuestas",
    frecuencia: {
      $round: [{ $divide: ["$siniestros", "$exposicion.polizasExpuestas"] }, 6]
    },
    montoTotal: 1,
    severidadPromedio: { $round: ["$severidadPromedio", 2] },
    costoPorExpuesta: {
      $round: [{ $divide: ["$montoTotal", "$exposicion.polizasExpuestas"] }, 2]
    }
  }
})
pipeline.push({ $sort: { periodo: 1 } })

db.siniestros_temporales.aggregate(pipeline).toArray()
```

Resultado esperado:

| Periodo | Siniestros | Expuestas | Frecuencia | Severidad promedio | Costo por expuesta |
|---|---:|---:|---:|---:|---:|
| 2026-01 | 3 | 1000 | 0.003000 | 50000 | 150.00 |
| 2026-02 | 2 | 980 | 0.002041 | 37500 | 76.53 |
| 2026-03 | 3 | 1020 | 0.002941 | 60000 | 176.47 |

#### Recapitulación ejecutable

```bash
exit
bash ejemplos/semana04/ejemplo15/scripts/ejecutar.sh
```

### 4. Interpretación :mag:

La frecuencia divide siniestros cerrados entre pólizas expuestas del mismo mes,
producto y región. La severidad divide monto entre siniestros y el costo por
expuesta divide monto entre exposición. Comparar sólo el conteo ignoraría que
el denominador cambia entre periodos. Estos indicadores describen el conjunto
sintético y no constituyen una estimación actuarial completa.

### 5. Relación con el Reto 08 :link:

El reto aplica el mismo cambio de unidad a otra serie y añade mínimos, máximos
e interpretación de cambios.

[`← Semana 04`](../README.md) | [`Ejemplo 16 →`](../ejemplo16/README.md)

</div>

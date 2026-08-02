[`Conceptos avanzados de bases de datos NoSQL`](../../README.md) > `Semana 04`

# Semana 04: Datos a través del tiempo: series temporales

<div style="text-align: justify;">

Durante esta semana incorporaremos el tiempo como parte explícita del modelo.
Primero distinguiremos observaciones periódicas y eventos irregulares,
conservaremos marcas de tiempo BSON `Date`, metadatos estables y granularidad,
y construiremos consultas por intervalos. Después agruparemos por periodo,
incorporaremos exposición y compararemos máximos y variaciones.

## 1. Objetivo :dart:

- Distinguir tiempo de ocurrencia, tiempo de registro y periodo de análisis.
- Separar metadatos de serie y valores observados.
- Declarar frecuencia de captura y granularidad de análisis.
- Consultar intervalos semiabiertos y ordenar cronológicamente.
- Crear índices que combinen serie y tiempo.
- Calcular frecuencia sólo cuando existe un denominador de exposición.
- Resumir severidad, mínimos, máximos y variaciones por periodo.
- Describir patrones observados sin convertirlos en pronósticos ni causalidad.

## 2. Sesión 10: Modelado y almacenamiento temporal :stopwatch:

Al comenzar el Ejemplo 13 actualizarás la copia del repositorio mediante
`git pull --ff-only`. La sesión contrasta observaciones mensuales con eventos
que ocurren en momentos irregulares.

---

### <ins>Exposición periódica</ins>

Transformaremos fechas textuales en BSON `Date`, separaremos metadatos y
mediciones, declararemos la granularidad mensual y crearemos un índice por
serie y periodo.

- [**`EJEMPLO 13`**](ejemplo13/README.md)

---

### <ins>Historial de eventos</ins>

Modelaremos movimientos con tiempo de ocurrencia y registro, consultaremos un
intervalo semiabierto y recuperaremos el historial en orden cronológico.

- [**`EJEMPLO 14`**](ejemplo14/README.md)
- [**`RETO 07`**](../../retos/semana04/reto07/README.md)

---

## 3. Sesión 11: Agregación y análisis temporal :chart_with_upwards_trend:

Al comenzar el Ejemplo 15 volverás a actualizar el repositorio. La sesión
separa cantidad, exposición, frecuencia, monto y severidad antes de comparar
periodos.

---

### <ins>Frecuencia y severidad por periodo</ins>

Agruparemos siniestros cerrados por mes, uniremos su exposición y calcularemos
indicadores con unidades explícitas.

- [**`EJEMPLO 15`**](ejemplo15/README.md)

---

### <ins>Máximos, variaciones y patrón observado</ins>

Calcularemos mínimos y máximos, compararemos meses consecutivos e
identificaremos un patrón no monótono dentro del intervalo disponible.

- [**`EJEMPLO 16`**](ejemplo16/README.md)
- [**`RETO 08`**](../../retos/semana04/reto08/README.md)

---

[`← Semana 03`](../semana03/README.md) | [`Regresar al inicio`](../../README.md)

</div>

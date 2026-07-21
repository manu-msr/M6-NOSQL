# Datos sintéticos del módulo

Los datos de este directorio son ficticios y se diseñaron únicamente con fines
didácticos. No representan un portafolio real ni una metodología actuarial
completa.

## Base reutilizable

`base/cargar_datos_base.js` crea la base `m6_nosql` y restablece estas
colecciones:

- `polizas`: seis pólizas con coberturas embebidas;
- `polizas_referencias`: las mismas pólizas sin las coberturas embebidas;
- `coberturas_poliza`: coberturas como documentos con referencia a una póliza;
- `siniestros`: diez eventos asociados mediante `polizaId`.

La duplicación entre `polizas` y `polizas_referencias` permite representar las
mismas pólizas con coberturas embebidas o separadas. Las cuatro colecciones
forman el modelo de trabajo de los ejemplos 01 a 04; `siniestros` también se
utiliza en el Reto 01 para comprobar el entorno y `polizas` vuelve a utilizarse
en los ejemplos 05 y 06 para comparar planes e índices.

## Semana 2

[`semana02/README.md`](semana02/README.md) documenta las colecciones temporales
de validación y los conjuntos independientes de los retos 03 y 04.

## Evolución

- Semana 1: modelo documental, consultas y agregaciones.
- Semana 2: indexación sobre `polizas` y colecciones independientes para los
  retos de rendimiento y validación.
- Semanas posteriores: podrán añadirse campos o colecciones sin modificar el
  significado de los identificadores existentes.

Cada ampliación deberá documentar qué cambió y qué ejemplos o retos la usan.

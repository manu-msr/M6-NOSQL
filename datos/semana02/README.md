# Datos sintéticos de la semana 2

## Ejemplos 05 y 06

Reutilizan `datos/base/cargar_datos_base.js` y la colección `polizas`. Cada
demostración elimina los índices secundarios antes de crear la estructura que
analiza.

## Ejemplos 07 y 08

Crean colecciones independientes de corta duración:

- `siniestros_validados_ejemplo`;
- `polizas_validadas_ejemplo`.

Los documentos se generan dentro de los scripts de demostración y no modifican
las colecciones base.

## Reto 03

`retos/semana02/reto03/datos/cargar_datos_reto03.js` genera 240 pólizas
sintéticas en `polizas_indexacion_reto`. La colección comienza sólo con `_id_`
para permitir una comparación reproducible antes y después de indexar.

## Reto 04

`retos/semana02/reto04/datos/cargar_datos_reto04.js` crea la colección vacía
`siniestros_validacion_reto` sin validador. La actividad incorpora y prueba la
regla mediante `collMod`.

Ninguno de estos conjuntos representa personas, pólizas o siniestros reales.

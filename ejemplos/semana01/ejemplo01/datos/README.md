# Datos del Ejemplo 01

Este ejemplo reutiliza la fuente común:

- [`../../../../datos/base/cargar_datos_base.js`](../../../../datos/base/cargar_datos_base.js)

Colecciones mostradas durante el recorrido:

- `polizas`: seis pólizas con coberturas embebidas;
- `polizas_referencias`: seis pólizas sin las coberturas embebidas;
- `coberturas_poliza`: coberturas relacionadas mediante `polizaId`;
- `siniestros`: diez eventos asociados con una póliza.

No se duplica el archivo de carga dentro del ejemplo para evitar que dos copias
del mismo conjunto evolucionen de manera distinta.

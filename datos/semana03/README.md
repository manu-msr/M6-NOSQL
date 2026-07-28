# Datos sintéticos de la semana 3

`cargar_datos_semana03.js` restablece cinco colecciones independientes de los
datos base:

- `bienes_geo_fuente`: seis bienes con longitud y latitud separadas;
- `zonas_riesgo_fuente`: tres zonas con sus vértices;
- `bienes_geo`: los seis bienes representados mediante puntos GeoJSON;
- `zonas_riesgo`: las tres zonas representadas mediante polígonos GeoJSON;
- `siniestros_geo`: ocho eventos con puntos GeoJSON.

Las colecciones `*_fuente` permiten hacer visible la transformación hacia
GeoJSON en los ejemplos 09 y 10. Las otras colecciones sostienen las consultas
de proximidad, pertenencia, intersección y agrupación de los ejemplos 11 y 12.

El cargador no crea índices geoespaciales. Cada demostración construye y
verifica el índice que necesita para conservar visible esa decisión.

Para restablecer y comprobar los datos desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/cargar_datos_semana03.js

./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana03/verificar_datos_semana03.js
```

Todos los identificadores, montos, ubicaciones y zonas son sintéticos. Las
geometrías sirven para estudiar las operaciones de MongoDB; no representan un
mapa oficial, una zonificación vigente ni una metodología actuarial completa.

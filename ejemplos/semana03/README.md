[`Conceptos avanzados de bases de datos NoSQL`](../../README.md) > `Semana 03`

# Semana 03: Datos en el mapa: consultas geoespaciales

<div style="text-align: justify;">

Durante esta semana incorporaremos ubicación al modelo documental. Primero
representaremos puntos y polígonos GeoJSON, revisaremos su calidad y crearemos
índices `2dsphere`. Después formularemos consultas de cercanía, pertenencia e
intersección y combinaremos la selección espacial con filtros y agregaciones
temáticas.

## 1. Objetivo :dart:

- Distinguir geometría y atributos temáticos.
- Conservar el sistema WGS84 y el orden longitud--latitud.
- Representar puntos y polígonos GeoJSON.
- Comprobar estructura, intervalos y cierre antes de indexar.
- Crear y verificar índices `2dsphere`.
- Elegir entre cercanía, pertenencia e intersección.
- Incorporar distancia y agrupaciones a pipelines geoespaciales.
- Interpretar resultados sin atribuir causalidad o riesgo no sustentados.

## 2. Sesión 7: Representación e indexación geoespacial :round_pushpin:

Al comenzar el Ejemplo 09 actualizarás la copia del repositorio mediante
`git pull --ff-only`. La sesión parte de coordenadas separadas y hace visible
cómo se transforman en geometrías que MongoDB puede interpretar e indexar.

---

### <ins>Puntos GeoJSON para bienes asegurados</ins>

Transformaremos longitud y latitud en objetos `Point`, conservaremos los
atributos del bien y verificaremos el índice `2dsphere`.

- [**`EJEMPLO 09`**](ejemplo09/README.md)

---

### <ins>Polígonos GeoJSON para zonas</ins>

Ampliaremos la representación a regiones. Revisaremos el anidamiento de
`coordinates`, el cierre del anillo y el índice sobre la geometría.

- [**`EJEMPLO 10`**](ejemplo10/README.md)
- [**`RETO 05`**](../../retos/semana03/reto05/README.md)

---

## 3. Sesión 8: Consultas y análisis geoespacial :world_map:

Al comenzar el Ejemplo 11 volverás a actualizar el repositorio. La sesión
separa tres preguntas: qué está cerca, qué está dentro y qué se intersecta.

---

### <ins>Cercanía y distancia</ins>

Localizaremos bienes vigentes dentro de un radio mediante `$near` y
utilizaremos `$geoNear` cuando la distancia deba continuar dentro de un
pipeline.

- [**`EJEMPLO 11`**](ejemplo11/README.md)

---

### <ins>Pertenencia, intersección y resumen territorial</ins>

Seleccionaremos siniestros contenidos en una zona, contrastaremos esa relación
con la intersección y agruparemos sólo los eventos que satisfacen las
condiciones geográfica y temática.

- [**`EJEMPLO 12`**](ejemplo12/README.md)
- [**`RETO 06`**](../../retos/semana03/reto06/README.md)

---

[`← Semana 02`](../semana02/README.md) | [`Regresar al inicio`](../../README.md)

</div>

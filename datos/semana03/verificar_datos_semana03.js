var curso = db.getSiblingDB("m6_nosql");

function esPuntoValido(geometria) {
  if (!geometria || geometria.type !== "Point") {
    return false;
  }
  if (!Array.isArray(geometria.coordinates) || geometria.coordinates.length !== 2) {
    return false;
  }
  var longitud = geometria.coordinates[0];
  var latitud = geometria.coordinates[1];
  return typeof longitud === "number" &&
    typeof latitud === "number" &&
    longitud >= -180 &&
    longitud <= 180 &&
    latitud >= -90 &&
    latitud <= 90;
}

function esPoligonoCerrado(geometria) {
  if (
    !geometria ||
    geometria.type !== "Polygon" ||
    !Array.isArray(geometria.coordinates) ||
    !Array.isArray(geometria.coordinates[0])
  ) {
    return false;
  }
  var anillo = geometria.coordinates[0];
  if (anillo.length < 4) {
    return false;
  }
  var primero = anillo[0];
  var ultimo = anillo[anillo.length - 1];
  return primero[0] === ultimo[0] && primero[1] === ultimo[1];
}

var bienes = curso.bienes_geo.find({}).toArray();
var zonas = curso.zonas_riesgo.find({}).toArray();
var siniestros = curso.siniestros_geo.find({}).toArray();

if (bienes.length !== 6 || !bienes.every(function (bien) {
  return esPuntoValido(bien.ubicacion);
})) {
  throw new Error("Los bienes de la semana 3 no contienen seis puntos GeoJSON válidos.");
}

if (zonas.length !== 3 || !zonas.every(function (zona) {
  return esPoligonoCerrado(zona.geometria);
})) {
  throw new Error("Las zonas de la semana 3 no contienen tres polígonos cerrados.");
}

if (siniestros.length !== 8 || !siniestros.every(function (siniestro) {
  return esPuntoValido(siniestro.ubicacion);
})) {
  throw new Error("Los siniestros de la semana 3 no contienen ocho puntos GeoJSON válidos.");
}

print("Verificación de la semana 3 correcta.");
print("6 bienes con Point, 3 zonas con Polygon y 8 siniestros con Point.");

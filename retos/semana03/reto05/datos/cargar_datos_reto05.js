// Datos sintéticos exclusivos del Reto 05.

var curso = db.getSiblingDB("m6_nosql");
var fuente = curso.bienes_coordenadas_reto;
var destino = curso.bienes_georreferenciados_reto;

fuente.drop();
destino.drop();

fuente.insertMany([
  {
    _id: "RET-GEO-F-01",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1250000,
    longitud: -99.1600,
    latitud: 19.4300
  },
  {
    _id: "RET-GEO-F-02",
    producto: "comercio",
    estado: "vigente",
    sumaAsegurada: 2900000,
    longitud: -99.1250,
    latitud: 19.4450
  },
  {
    _id: "RET-GEO-F-03",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1680000,
    longitud: -99.1000,
    latitud: 19.4700
  },
  {
    _id: "RET-GEO-F-04",
    producto: "comercio",
    estado: "vencida",
    sumaAsegurada: 3400000,
    longitud: -99.1900,
    latitud: 19.4100
  },
  {
    _id: "RET-GEO-F-05",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1150000,
    longitud: -99.1350,
    latitud: 19.4900
  },
  {
    _id: "RET-GEO-F-06",
    producto: "comercio",
    estado: "vigente",
    sumaAsegurada: 3750000,
    longitud: -99.0800,
    latitud: 19.4000
  },
  {
    _id: "RET-GEO-F-07",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 920000,
    longitud: -99.1200,
    latitud: 95.0000
  }
]);

curso.createCollection("bienes_georreferenciados_reto");

if (
  fuente.countDocuments({}) !== 7 ||
  destino.countDocuments({}) !== 0 ||
  destino.getIndexes().length !== 1
) {
  throw new Error("La preparación del Reto 05 no coincide con siete fuentes y un destino vacío.");
}

print("Datos del Reto 05 cargados en m6_nosql.");
print("7 coordenadas fuente; colección de destino vacía y sin índice secundario.");

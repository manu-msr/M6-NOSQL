// Datos sintéticos exclusivos del Reto 06.

var curso = db.getSiblingDB("m6_nosql");
var zonas = curso.zonas_analisis_reto;
var siniestros = curso.siniestros_zona_reto;

zonas.drop();
siniestros.drop();

zonas.insertOne({
  _id: "ZONA-RET-01",
  categoria: "evaluacion_hidrometeorologica",
  vigencia: "2026",
  geometria: {
    type: "Polygon",
    coordinates: [[
      [-99.1800, 19.4000],
      [-99.1200, 19.4000],
      [-99.1200, 19.4500],
      [-99.1800, 19.4500],
      [-99.1800, 19.4000]
    ]]
  }
});

siniestros.insertMany([
  {
    _id: "RET-ZON-01",
    tipoEvento: "inundacion",
    estado: "cerrado",
    montoReclamado: 120000,
    ubicacion: { type: "Point", coordinates: [-99.1600, 19.4200] }
  },
  {
    _id: "RET-ZON-02",
    tipoEvento: "inundacion",
    estado: "cerrado",
    montoReclamado: 80000,
    ubicacion: { type: "Point", coordinates: [-99.1400, 19.4300] }
  },
  {
    _id: "RET-ZON-03",
    tipoEvento: "incendio",
    estado: "cerrado",
    montoReclamado: 50000,
    ubicacion: { type: "Point", coordinates: [-99.1300, 19.4250] }
  },
  {
    _id: "RET-ZON-04",
    tipoEvento: "incendio",
    estado: "en_revision",
    montoReclamado: 70000,
    ubicacion: { type: "Point", coordinates: [-99.1500, 19.4400] }
  },
  {
    _id: "RET-ZON-05",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 40000,
    ubicacion: { type: "Point", coordinates: [-99.1700, 19.4100] }
  },
  {
    _id: "RET-ZON-06",
    tipoEvento: "inundacion",
    estado: "cerrado",
    montoReclamado: 200000,
    ubicacion: { type: "Point", coordinates: [-99.1000, 19.4600] }
  },
  {
    _id: "RET-ZON-07",
    tipoEvento: "incendio",
    estado: "cerrado",
    montoReclamado: 110000,
    ubicacion: { type: "Point", coordinates: [-99.2000, 19.3900] }
  },
  {
    _id: "RET-ZON-08",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 60000,
    ubicacion: { type: "Point", coordinates: [-99.1250, 19.4400] }
  },
  {
    _id: "RET-ZON-09",
    tipoEvento: "inundacion",
    estado: "rechazado",
    montoReclamado: 90000,
    ubicacion: { type: "Point", coordinates: [-99.1450, 19.4150] }
  },
  {
    _id: "RET-ZON-10",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 30000,
    ubicacion: { type: "Point", coordinates: [-99.0900, 19.4000] }
  }
]);

zonas.createIndex(
  { geometria: "2dsphere" },
  { name: "geometria_2dsphere" }
);
siniestros.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
);

if (
  zonas.countDocuments({}) !== 1 ||
  siniestros.countDocuments({}) !== 10 ||
  zonas.getIndexes().length !== 2 ||
  siniestros.getIndexes().length !== 2
) {
  throw new Error("La preparación del Reto 06 no coincide con las cantidades e índices esperados.");
}

print("Datos del Reto 06 cargados en m6_nosql.");
print("1 zona, 10 siniestros y sus índices 2dsphere.");

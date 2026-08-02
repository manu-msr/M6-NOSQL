var curso = db.getSiblingDB("m6_nosql");

curso.mediciones_riesgo_reto_fuente.drop();
curso.mediciones_riesgo_reto.drop();

curso.mediciones_riesgo_reto_fuente.insertMany([
  { _id: "MED-RET-01", medidoEnTexto: "2026-04-10T00:00:00Z", sensorId: "SEN-RET-01", variable: "precipitacion", zona: "norte", unidad: "mm_h", valor: 12 },
  { _id: "MED-RET-02", medidoEnTexto: "2026-04-10T00:30:00Z", sensorId: "SEN-RET-01", variable: "precipitacion", zona: "norte", unidad: "mm_h", valor: 18 },
  { _id: "MED-RET-03", medidoEnTexto: "2026-04-10T01:00:00Z", sensorId: "SEN-RET-01", variable: "precipitacion", zona: "norte", unidad: "mm_h", valor: 22 },
  { _id: "MED-RET-04", medidoEnTexto: "2026-04-10T01:30:00Z", sensorId: "SEN-RET-01", variable: "precipitacion", zona: "norte", unidad: "mm_h", valor: 15 },
  { _id: "MED-RET-05", medidoEnTexto: "2026-04-10T00:00:00Z", sensorId: "SEN-RET-02", variable: "precipitacion", zona: "sur", unidad: "mm_h", valor: 6 },
  { _id: "MED-RET-06", medidoEnTexto: "2026-04-10T00:30:00Z", sensorId: "SEN-RET-02", variable: "precipitacion", zona: "sur", unidad: "mm_h", valor: 9 },
  { _id: "MED-RET-07", medidoEnTexto: "2026-04-10T01:00:00Z", sensorId: "SEN-RET-02", variable: "precipitacion", zona: "sur", unidad: "mm_h", valor: 11 },
  { _id: "MED-RET-08", medidoEnTexto: "2026-04-10T01:30:00Z", sensorId: "SEN-RET-02", variable: "precipitacion", zona: "sur", unidad: "mm_h", valor: 7 }
]);

if (curso.mediciones_riesgo_reto_fuente.countDocuments({}) !== 8) {
  throw new Error("La carga del Reto 07 no produjo ocho fuentes.");
}

print("Datos del Reto 07 cargados.");
print("8 lecturas fuente; la colección modelada queda pendiente para el reto.");

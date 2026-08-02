var curso = db.getSiblingDB("m6_nosql");

curso.siniestros_temporales_reto08.drop();
curso.exposicion_temporal_reto08.drop();

curso.exposicion_temporal_reto08.insertMany([
  { _id: "hogar|centro|2026-01", periodo: new Date("2026-01-01T00:00:00Z"), meta: { producto: "hogar", region: "centro" }, polizasExpuestas: 500, claveSeriePeriodo: "hogar|centro|2026-01" },
  { _id: "hogar|centro|2026-02", periodo: new Date("2026-02-01T00:00:00Z"), meta: { producto: "hogar", region: "centro" }, polizasExpuestas: 510, claveSeriePeriodo: "hogar|centro|2026-02" },
  { _id: "hogar|centro|2026-03", periodo: new Date("2026-03-01T00:00:00Z"), meta: { producto: "hogar", region: "centro" }, polizasExpuestas: 505, claveSeriePeriodo: "hogar|centro|2026-03" }
]);

curso.siniestros_temporales_reto08.insertMany([
  { _id: "SIN-RET8-01", ocurrioEn: new Date("2026-01-08T08:00:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 20000 },
  { _id: "SIN-RET8-02", ocurrioEn: new Date("2026-01-24T17:30:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 40000 },
  { _id: "SIN-RET8-03", ocurrioEn: new Date("2026-02-03T11:15:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 15000 },
  { _id: "SIN-RET8-04", ocurrioEn: new Date("2026-02-14T19:05:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 25000 },
  { _id: "SIN-RET8-05", ocurrioEn: new Date("2026-02-27T06:40:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 50000 },
  { _id: "SIN-RET8-06", ocurrioEn: new Date("2026-03-09T13:20:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 60000 },
  { _id: "SIN-RET8-07", ocurrioEn: new Date("2026-03-21T22:10:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "cerrado", montoPagado: 80000 },
  { _id: "SIN-RET8-08", ocurrioEn: new Date("2026-03-18T09:00:00Z"), meta: { producto: "hogar", region: "centro" }, estado: "en_revision", montoPagado: 100000 },
  { _id: "SIN-RET8-09", ocurrioEn: new Date("2026-02-20T10:00:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 30000 }
]);

curso.exposicion_temporal_reto08.createIndex(
  { claveSeriePeriodo: 1 },
  { name: "clave_serie_periodo", unique: true }
);
curso.siniestros_temporales_reto08.createIndex(
  { "meta.producto": 1, "meta.region": 1, estado: 1, ocurrioEn: 1 },
  { name: "serie_estado_ocurrencia" }
);

if (
  curso.exposicion_temporal_reto08.countDocuments({}) !== 3 ||
  curso.siniestros_temporales_reto08.countDocuments({}) !== 9
) {
  throw new Error("La carga del Reto 08 no produjo las cantidades esperadas.");
}

print("Datos del Reto 08 cargados.");
print("3 exposiciones mensuales y 9 siniestros temporales.");

// Datos sintéticos compartidos por los ejemplos 13 a 16.

var curso = db.getSiblingDB("m6_nosql");

[
  "exposicion_temporal_fuente",
  "exposicion_temporal",
  "movimientos_temporales",
  "siniestros_temporales"
].forEach(function (nombre) {
  curso[nombre].drop();
});

var exposicionFuente = [
  {
    _id: "EXP-FUE-001",
    periodoTexto: "2026-01-01T00:00:00Z",
    producto: "auto",
    region: "centro",
    polizasExpuestas: 1000,
    sumaAsegurada: 420000000
  },
  {
    _id: "EXP-FUE-002",
    periodoTexto: "2026-02-01T00:00:00Z",
    producto: "auto",
    region: "centro",
    polizasExpuestas: 980,
    sumaAsegurada: 415000000
  },
  {
    _id: "EXP-FUE-003",
    periodoTexto: "2026-03-01T00:00:00Z",
    producto: "auto",
    region: "centro",
    polizasExpuestas: 1020,
    sumaAsegurada: 432000000
  },
  {
    _id: "EXP-FUE-004",
    periodoTexto: "2026-01-01T00:00:00Z",
    producto: "auto",
    region: "norte",
    polizasExpuestas: 700,
    sumaAsegurada: 286000000
  },
  {
    _id: "EXP-FUE-005",
    periodoTexto: "2026-02-01T00:00:00Z",
    producto: "auto",
    region: "norte",
    polizasExpuestas: 710,
    sumaAsegurada: 291000000
  },
  {
    _id: "EXP-FUE-006",
    periodoTexto: "2026-03-01T00:00:00Z",
    producto: "auto",
    region: "norte",
    polizasExpuestas: 705,
    sumaAsegurada: 289000000
  }
];

curso.exposicion_temporal_fuente.insertMany(exposicionFuente);

curso.exposicion_temporal.insertMany(exposicionFuente.map(function (registro) {
  var periodo = new Date(registro.periodoTexto);
  var periodoClave = registro.periodoTexto.slice(0, 7);
  return {
    _id: registro.producto + "|" + registro.region + "|" + periodoClave,
    periodo: periodo,
    meta: {
      producto: registro.producto,
      region: registro.region
    },
    granularidad: "mensual",
    polizasExpuestas: registro.polizasExpuestas,
    sumaAsegurada: registro.sumaAsegurada,
    claveSeriePeriodo: registro.producto + "|" + registro.region + "|" + periodoClave
  };
}));

curso.movimientos_temporales.insertMany([
  {
    _id: "MOV-TEM-001",
    ocurrioEn: new Date("2026-01-01T00:00:00Z"),
    registradoEn: new Date("2026-01-01T00:04:00Z"),
    meta: { polizaId: "POL-TEM-001", tipoEvento: "prima_emitida" },
    monto: 12000,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-002",
    ocurrioEn: new Date("2026-01-10T16:20:00Z"),
    registradoEn: new Date("2026-01-10T16:21:00Z"),
    meta: { polizaId: "POL-TEM-001", tipoEvento: "pago_recibido" },
    monto: 12000,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-003",
    ocurrioEn: new Date("2026-02-05T12:00:00Z"),
    registradoEn: new Date("2026-02-05T12:08:00Z"),
    meta: { polizaId: "POL-TEM-001", tipoEvento: "ajuste_cobertura" },
    monto: 1800,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-004",
    ocurrioEn: new Date("2026-02-18T09:35:00Z"),
    registradoEn: new Date("2026-02-18T10:02:00Z"),
    meta: { polizaId: "POL-TEM-001", tipoEvento: "aviso_siniestro" },
    monto: 0,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-005",
    ocurrioEn: new Date("2026-03-03T18:10:00Z"),
    registradoEn: new Date("2026-03-04T08:15:00Z"),
    meta: { polizaId: "POL-TEM-001", tipoEvento: "pago_siniestro" },
    monto: 48000,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-006",
    ocurrioEn: new Date("2026-01-15T00:00:00Z"),
    registradoEn: new Date("2026-01-15T00:03:00Z"),
    meta: { polizaId: "POL-TEM-002", tipoEvento: "prima_emitida" },
    monto: 9500,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-007",
    ocurrioEn: new Date("2026-02-01T14:05:00Z"),
    registradoEn: new Date("2026-02-01T14:06:00Z"),
    meta: { polizaId: "POL-TEM-002", tipoEvento: "pago_recibido" },
    monto: 9500,
    moneda: "MXN"
  },
  {
    _id: "MOV-TEM-008",
    ocurrioEn: new Date("2026-03-22T11:30:00Z"),
    registradoEn: new Date("2026-03-22T11:36:00Z"),
    meta: { polizaId: "POL-TEM-002", tipoEvento: "ajuste_cobertura" },
    monto: 750,
    moneda: "MXN"
  }
]);

curso.siniestros_temporales.insertMany([
  { _id: "SIN-TEM-001", ocurrioEn: new Date("2026-01-05T10:00:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 40000 },
  { _id: "SIN-TEM-002", ocurrioEn: new Date("2026-01-18T15:30:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 50000 },
  { _id: "SIN-TEM-003", ocurrioEn: new Date("2026-01-27T08:45:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 60000 },
  { _id: "SIN-TEM-004", ocurrioEn: new Date("2026-02-09T12:15:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 30000 },
  { _id: "SIN-TEM-005", ocurrioEn: new Date("2026-02-22T19:20:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 45000 },
  { _id: "SIN-TEM-006", ocurrioEn: new Date("2026-03-03T07:40:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 70000 },
  { _id: "SIN-TEM-007", ocurrioEn: new Date("2026-03-14T13:10:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 50000 },
  { _id: "SIN-TEM-008", ocurrioEn: new Date("2026-03-28T21:05:00Z"), meta: { producto: "auto", region: "centro" }, estado: "cerrado", montoPagado: 60000 },
  { _id: "SIN-TEM-009", ocurrioEn: new Date("2026-03-20T09:00:00Z"), meta: { producto: "auto", region: "centro" }, estado: "en_revision", montoPagado: 90000 },
  { _id: "SIN-TEM-010", ocurrioEn: new Date("2026-02-15T11:00:00Z"), meta: { producto: "vida", region: "centro" }, estado: "cerrado", montoPagado: 100000 }
]);

var cantidades = {
  exposicionFuente: curso.exposicion_temporal_fuente.countDocuments({}),
  exposicionTemporal: curso.exposicion_temporal.countDocuments({}),
  movimientosTemporales: curso.movimientos_temporales.countDocuments({}),
  siniestrosTemporales: curso.siniestros_temporales.countDocuments({})
};

if (
  cantidades.exposicionFuente !== 6 ||
  cantidades.exposicionTemporal !== 6 ||
  cantidades.movimientosTemporales !== 8 ||
  cantidades.siniestrosTemporales !== 10
) {
  throw new Error("La carga de la semana 4 no produjo las cantidades esperadas.");
}

print("Datos sintéticos de la semana 4 cargados en m6_nosql.");
printjson(cantidades);

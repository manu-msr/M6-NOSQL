// Datos sintéticos exclusivos del Reto 02.

var curso = db.getSiblingDB("m6_nosql");

curso.polizas_agregacion_reto.deleteMany({});
curso.siniestros_agregacion_reto.deleteMany({});

curso.polizas_agregacion_reto.insertMany([
  { _id: "A-POL-301", producto: "hogar", estado: "vigente" },
  { _id: "A-POL-302", producto: "auto", estado: "vigente" },
  { _id: "A-POL-303", producto: "auto", estado: "vigente" },
  { _id: "A-POL-304", producto: "hogar", estado: "vigente" },
  { _id: "A-POL-305", producto: "auto", estado: "cancelada" }
]);

curso.siniestros_agregacion_reto.insertMany([
  {
    _id: "A-SIN-01", polizaId: "A-POL-301",
    fechaOcurrencia: ISODate("2026-01-10T00:00:00Z"),
    estado: "en_revision", montoReclamado: 90000,
    coberturasAfectadas: ["DAN"]
  },
  {
    _id: "A-SIN-02", polizaId: "A-POL-302",
    fechaOcurrencia: ISODate("2026-01-20T00:00:00Z"),
    estado: "en_revision", montoReclamado: 45000,
    coberturasAfectadas: ["DM"]
  },
  {
    _id: "A-SIN-03", polizaId: "A-POL-303",
    fechaOcurrencia: ISODate("2026-02-12T00:00:00Z"),
    estado: "cerrado", montoReclamado: 70000,
    coberturasAfectadas: ["DM"]
  },
  {
    _id: "A-SIN-04", polizaId: "A-POL-304",
    fechaOcurrencia: ISODate("2026-03-05T00:00:00Z"),
    estado: "en_revision", montoReclamado: 120000,
    coberturasAfectadas: ["ROB", "DAN"]
  },
  {
    _id: "A-SIN-05", polizaId: "A-POL-302",
    fechaOcurrencia: ISODate("2026-04-15T00:00:00Z"),
    estado: "en_revision", montoReclamado: 80000,
    coberturasAfectadas: ["DM", "RC"]
  },
  {
    _id: "A-SIN-06", polizaId: "A-POL-301",
    fechaOcurrencia: ISODate("2026-05-18T00:00:00Z"),
    estado: "rechazado", montoReclamado: 50000,
    coberturasAfectadas: ["DAN"]
  },
  {
    _id: "A-SIN-07", polizaId: "A-POL-303",
    fechaOcurrencia: ISODate("2026-06-02T00:00:00Z"),
    estado: "en_revision", montoReclamado: 60000,
    coberturasAfectadas: ["DM"]
  },
  {
    _id: "A-SIN-08", polizaId: "A-POL-304",
    fechaOcurrencia: ISODate("2026-07-01T00:00:00Z"),
    estado: "en_revision", montoReclamado: 110000,
    coberturasAfectadas: ["ROB"]
  }
]);

var totalPolizas = curso.polizas_agregacion_reto.countDocuments({});
var totalSiniestros = curso.siniestros_agregacion_reto.countDocuments({});

if (totalPolizas !== 5 || totalSiniestros !== 8) {
  throw new Error("La verificación del Reto 02 no coincide con 5 pólizas y 8 siniestros.");
}

print("Datos del Reto 02 cargados en m6_nosql.");
print(totalPolizas + " pólizas y " + totalSiniestros + " siniestros.");

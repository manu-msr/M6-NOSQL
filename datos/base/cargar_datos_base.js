// Datos sintéticos de la semana 1. Ejecutar desde la terminal integrada del Learner Lab.
// El script es repetible: restablece sólo las colecciones didácticas indicadas.

var curso = db.getSiblingDB("m6_nosql");

curso.polizas.deleteMany({});
curso.polizas_referencias.deleteMany({});
curso.coberturas_poliza.deleteMany({});
curso.siniestros.deleteMany({});

var polizasEmbebidas = [
  {
    _id: "POL-1001",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1500000,
    vigencia: {
      inicio: ISODate("2026-01-01T00:00:00Z"),
      fin: ISODate("2026-12-31T23:59:59Z")
    },
    coberturas: [
      { clave: "INC", nombre: "incendio", limite: 1500000 },
      { clave: "ROB", nombre: "robo", limite: 250000 },
      { clave: "DAN", nombre: "danios accidentales", limite: 180000 }
    ]
  },
  {
    _id: "POL-1002",
    producto: "auto",
    estado: "vigente",
    sumaAsegurada: 480000,
    vigencia: {
      inicio: ISODate("2026-02-01T00:00:00Z"),
      fin: ISODate("2027-01-31T23:59:59Z")
    },
    coberturas: [
      { clave: "DM", nombre: "danios materiales", limite: 480000 },
      { clave: "RC", nombre: "responsabilidad civil", limite: 3000000 },
      { clave: "RT", nombre: "robo total", limite: 420000 }
    ]
  },
  {
    _id: "POL-1003",
    producto: "auto",
    estado: "vigente",
    sumaAsegurada: 350000,
    vigencia: {
      inicio: ISODate("2025-11-15T00:00:00Z"),
      fin: ISODate("2026-11-14T23:59:59Z")
    },
    coberturas: [
      { clave: "DM", nombre: "danios materiales", limite: 350000 },
      { clave: "RC", nombre: "responsabilidad civil", limite: 2500000 }
    ]
  },
  {
    _id: "POL-1004",
    producto: "hogar",
    estado: "cancelada",
    sumaAsegurada: 2100000,
    vigencia: {
      inicio: ISODate("2025-07-01T00:00:00Z"),
      fin: ISODate("2026-06-30T23:59:59Z")
    },
    coberturas: [
      { clave: "INC", nombre: "incendio", limite: 2100000 },
      { clave: "DAN", nombre: "danios accidentales", limite: 300000 }
    ]
  },
  {
    _id: "POL-1005",
    producto: "auto",
    estado: "vigente",
    sumaAsegurada: 620000,
    vigencia: {
      inicio: ISODate("2026-03-10T00:00:00Z"),
      fin: ISODate("2027-03-09T23:59:59Z")
    },
    coberturas: [
      { clave: "DM", nombre: "danios materiales", limite: 620000 },
      { clave: "RC", nombre: "responsabilidad civil", limite: 3000000 },
      { clave: "RT", nombre: "robo total", limite: 560000 }
    ]
  },
  {
    _id: "POL-1006",
    producto: "hogar",
    estado: "vencida",
    sumaAsegurada: 980000,
    vigencia: {
      inicio: ISODate("2025-01-01T00:00:00Z"),
      fin: ISODate("2025-12-31T23:59:59Z")
    },
    coberturas: [
      { clave: "INC", nombre: "incendio", limite: 980000 },
      { clave: "ROB", nombre: "robo", limite: 150000 }
    ]
  }
];

curso.polizas.insertMany(polizasEmbebidas);

curso.polizas_referencias.insertMany([
  { _id: "POL-1001", producto: "hogar", estado: "vigente", sumaAsegurada: 1500000,
    vigencia: { inicio: ISODate("2026-01-01T00:00:00Z"), fin: ISODate("2026-12-31T23:59:59Z") } },
  { _id: "POL-1002", producto: "auto", estado: "vigente", sumaAsegurada: 480000,
    vigencia: { inicio: ISODate("2026-02-01T00:00:00Z"), fin: ISODate("2027-01-31T23:59:59Z") } },
  { _id: "POL-1003", producto: "auto", estado: "vigente", sumaAsegurada: 350000,
    vigencia: { inicio: ISODate("2025-11-15T00:00:00Z"), fin: ISODate("2026-11-14T23:59:59Z") } },
  { _id: "POL-1004", producto: "hogar", estado: "cancelada", sumaAsegurada: 2100000,
    vigencia: { inicio: ISODate("2025-07-01T00:00:00Z"), fin: ISODate("2026-06-30T23:59:59Z") } },
  { _id: "POL-1005", producto: "auto", estado: "vigente", sumaAsegurada: 620000,
    vigencia: { inicio: ISODate("2026-03-10T00:00:00Z"), fin: ISODate("2027-03-09T23:59:59Z") } },
  { _id: "POL-1006", producto: "hogar", estado: "vencida", sumaAsegurada: 980000,
    vigencia: { inicio: ISODate("2025-01-01T00:00:00Z"), fin: ISODate("2025-12-31T23:59:59Z") } }
]);

var coberturasSeparadas = [];
polizasEmbebidas.forEach(function (poliza) {
  poliza.coberturas.forEach(function (cobertura, indice) {
    coberturasSeparadas.push({
      _id: poliza._id + "-COB-" + (indice + 1),
      polizaId: poliza._id,
      clave: cobertura.clave,
      nombre: cobertura.nombre,
      limite: cobertura.limite
    });
  });
});
curso.coberturas_poliza.insertMany(coberturasSeparadas);

curso.siniestros.insertMany([
  { _id: "SIN-0001", polizaId: "POL-1001", fechaOcurrencia: ISODate("2026-01-15T00:00:00Z"),
    montoReclamado: 84000, montoPagado: 60000, estado: "cerrado",
    coberturasAfectadas: ["DAN"], etiquetas: ["hogar", "danio_agua"],
    aviso: { canal: "portal", diasDespues: 2 } },
  { _id: "SIN-0002", polizaId: "POL-1002", fechaOcurrencia: ISODate("2026-02-18T00:00:00Z"),
    montoReclamado: 35000, montoPagado: 0, estado: "en_revision",
    coberturasAfectadas: ["DM"], etiquetas: ["auto", "colision"],
    aviso: { canal: "portal", diasDespues: 1 } },
  { _id: "SIN-0003", polizaId: "POL-1001", fechaOcurrencia: ISODate("2026-03-04T00:00:00Z"),
    montoReclamado: 125000, montoPagado: 0, estado: "en_revision",
    coberturasAfectadas: ["ROB"], etiquetas: ["hogar", "robo"],
    aviso: { canal: "portal", diasDespues: 3 } },
  { _id: "SIN-0004", polizaId: "POL-1003", fechaOcurrencia: ISODate("2026-03-21T00:00:00Z"),
    montoReclamado: 22000, montoPagado: 18000, estado: "cerrado",
    coberturasAfectadas: ["DM"], etiquetas: ["auto", "cristales"],
    aviso: { canal: "agente", diasDespues: 1 } },
  { _id: "SIN-0005", polizaId: "POL-1004", fechaOcurrencia: ISODate("2026-04-10T00:00:00Z"),
    montoReclamado: 210000, montoPagado: 0, estado: "rechazado",
    coberturasAfectadas: ["DAN"], etiquetas: ["hogar", "inundacion"],
    aviso: { canal: "telefono", diasDespues: 12 } },
  { _id: "SIN-0006", polizaId: "POL-1005", fechaOcurrencia: ISODate("2026-04-28T00:00:00Z"),
    montoReclamado: 67000, montoPagado: 52000, estado: "cerrado",
    coberturasAfectadas: ["DM", "RC"], etiquetas: ["auto", "colision"],
    aviso: { canal: "app", diasDespues: 0 } },
  { _id: "SIN-0007", polizaId: "POL-1006", fechaOcurrencia: ISODate("2025-10-17T00:00:00Z"),
    montoReclamado: 91000, montoPagado: 0, estado: "en_revision",
    coberturasAfectadas: ["INC"], etiquetas: ["hogar", "incendio"],
    aviso: { canal: "app", diasDespues: 4 } },
  { _id: "SIN-0008", polizaId: "POL-1002", fechaOcurrencia: ISODate("2026-05-06T00:00:00Z"),
    montoReclamado: 54000, montoPagado: 48000, estado: "cerrado",
    coberturasAfectadas: ["DM"], etiquetas: ["auto", "granizo"],
    aviso: { canal: "portal", diasDespues: 2 } },
  { _id: "SIN-0009", polizaId: "POL-1004", fechaOcurrencia: ISODate("2026-05-19T00:00:00Z"),
    montoReclamado: 76000, montoPagado: 0, estado: "en_revision",
    coberturasAfectadas: ["DAN"], etiquetas: ["hogar", "danio_agua"],
    aviso: { canal: "portal", diasDespues: 5 } },
  { _id: "SIN-0010", polizaId: "POL-1005", fechaOcurrencia: ISODate("2026-06-02T00:00:00Z"),
    montoReclamado: 18000, montoPagado: 16000, estado: "cerrado",
    coberturasAfectadas: ["DM"], etiquetas: ["auto", "cristales"],
    aviso: { canal: "agente", diasDespues: 1 } }
]);

print("Datos base cargados en la base m6_nosql.");
print("Colecciones: polizas, polizas_referencias, coberturas_poliza, siniestros.");

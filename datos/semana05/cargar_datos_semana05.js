// Datos sintéticos compartidos por los ejemplos 17 a 20.

var curso = db.getSiblingDB("m6_nosql");

[
  "avisos_texto",
  "casos_protegidos",
  "evidencias_protegidas",
  "casos_analitica"
].forEach(function (nombre) {
  curso[nombre].drop();
});

curso.avisos_texto.insertMany([
  {
    _id: "AV-TXT-01",
    codigo: "AUT-COL-001",
    producto: "Auto",
    estado: "abierto",
    categoria: "cristales",
    descripcion: "Daño por granizo en parabrisas y cofre"
  },
  {
    _id: "AV-TXT-02",
    codigo: "AUT-COL-002",
    producto: "Auto",
    estado: "cerrado",
    categoria: "inundacion",
    descripcion: "Ingreso de agua al motor por INUNDACIÓN"
  },
  {
    _id: "AV-TXT-03",
    codigo: "HOG-CDMX-001",
    producto: "Hogar",
    estado: "abierto",
    categoria: "inundacion",
    descripcion: "Daño por inundación en planta baja"
  },
  {
    _id: "AV-TXT-04",
    codigo: "HOG-PUE-002",
    producto: "Hogar",
    estado: "cerrado",
    categoria: "incendio",
    descripcion: "Daño por humo después de incendio en cocina"
  },
  {
    _id: "AV-TXT-05",
    codigo: "VID-CDMX-001",
    producto: "Vida",
    estado: "en_revision",
    categoria: "documentacion",
    descripcion: "Expediente en revisión por documentación incompleta"
  },
  {
    _id: "AV-TXT-06",
    codigo: "AUT-GDL-003",
    producto: "Auto",
    estado: "abierto",
    categoria: "cristales",
    descripcion: "Parabrisas roto por impacto de piedra"
  },
  {
    _id: "AV-TXT-07",
    codigo: "REP-AUT-004",
    producto: "Auto",
    estado: "abierto",
    categoria: "documentacion",
    descripcion: "Reporte complementario sin detalle del daño"
  }
]);

curso.casos_protegidos.insertMany([
  {
    _id: "CAS-SINT-001",
    polizaId: "POL-SINT-101",
    producto: "Auto",
    estado: "abierto",
    ocurridoEn: new Date("2026-05-04T12:00:00Z"),
    montoReclamado: 45000,
    descripcion: "Daño por granizo en parabrisas",
    titular: {
      idInterno: "TIT-SINT-001",
      nombre: "Persona sintética 01",
      correo: "persona01@example.invalid",
      telefono: "0000000001"
    },
    ubicacion: { entidad: "CDMX", codigoPostal: "01000" }
  },
  {
    _id: "CAS-SINT-002",
    polizaId: "POL-SINT-102",
    producto: "Hogar",
    estado: "cerrado",
    ocurridoEn: new Date("2026-05-06T16:30:00Z"),
    montoReclamado: 80000,
    descripcion: "Ingreso de agua en planta baja",
    titular: {
      idInterno: "TIT-SINT-002",
      nombre: "Persona sintética 02",
      correo: "persona02@example.invalid",
      telefono: "0000000002"
    },
    ubicacion: { entidad: "Puebla", codigoPostal: "72000" }
  },
  {
    _id: "CAS-SINT-003",
    polizaId: "POL-SINT-103",
    producto: "Auto",
    estado: "abierto",
    ocurridoEn: new Date("2026-05-18T09:15:00Z"),
    montoReclamado: 27000,
    descripcion: "Daño por impacto de piedra",
    titular: {
      idInterno: "TIT-SINT-003",
      nombre: "Persona sintética 03",
      correo: "persona03@example.invalid",
      telefono: "0000000003"
    },
    ubicacion: { entidad: "Jalisco", codigoPostal: "44100" }
  },
  {
    _id: "CAS-SINT-004",
    polizaId: "POL-SINT-104",
    producto: "Vida",
    estado: "en_revision",
    ocurridoEn: new Date("2026-06-02T18:20:00Z"),
    montoReclamado: 120000,
    descripcion: "Documentación pendiente de revisión",
    titular: {
      idInterno: "TIT-SINT-004",
      nombre: "Persona sintética 04",
      correo: "persona04@example.invalid",
      telefono: "0000000004"
    },
    ubicacion: { entidad: "Querétaro", codigoPostal: "76000" }
  }
]);

curso.evidencias_protegidas.insertMany([
  {
    _id: "EVI-SINT-001",
    casoId: "CAS-SINT-001",
    tipo: "fotografia",
    recibidoEn: new Date("2026-05-04T13:10:00Z"),
    referencia: "REF-SINT-A1"
  },
  {
    _id: "EVI-SINT-002",
    casoId: "CAS-SINT-002",
    tipo: "dictamen",
    recibidoEn: new Date("2026-05-07T10:00:00Z"),
    referencia: "REF-SINT-B2"
  },
  {
    _id: "EVI-SINT-003",
    casoId: "CAS-SINT-003",
    tipo: "fotografia",
    recibidoEn: new Date("2026-05-18T10:05:00Z"),
    referencia: "REF-SINT-C3"
  }
]);

var cantidades = {
  avisosTexto: curso.avisos_texto.countDocuments({}),
  casosProtegidos: curso.casos_protegidos.countDocuments({}),
  evidenciasProtegidas: curso.evidencias_protegidas.countDocuments({})
};

if (
  cantidades.avisosTexto !== 7 ||
  cantidades.casosProtegidos !== 4 ||
  cantidades.evidenciasProtegidas !== 3
) {
  throw new Error("La carga de la semana 5 no produjo las cantidades esperadas.");
}

print("Datos sintéticos de la semana 5 cargados en m6_nosql.");
printjson(cantidades);

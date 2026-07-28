// Datos sintéticos compartidos por los ejemplos 09 a 12.

var curso = db.getSiblingDB("m6_nosql");

[
  "bienes_geo_fuente",
  "zonas_riesgo_fuente",
  "bienes_geo",
  "zonas_riesgo",
  "siniestros_geo"
].forEach(function (nombre) {
  curso[nombre].drop();
});

var bienesFuente = [
  {
    _id: "BIEN-GEO-01",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1800000,
    longitud: -99.1420,
    latitud: 19.4380
  },
  {
    _id: "BIEN-GEO-02",
    producto: "comercio",
    estado: "vigente",
    sumaAsegurada: 3200000,
    longitud: -99.1180,
    latitud: 19.4290
  },
  {
    _id: "BIEN-GEO-03",
    producto: "hogar",
    estado: "vigente",
    sumaAsegurada: 1450000,
    longitud: -99.1650,
    latitud: 19.4100
  },
  {
    _id: "BIEN-GEO-04",
    producto: "comercio",
    estado: "vigente",
    sumaAsegurada: 4100000,
    longitud: -99.0920,
    latitud: 19.4550
  },
  {
    _id: "BIEN-GEO-05",
    producto: "hogar",
    estado: "vencida",
    sumaAsegurada: 980000,
    longitud: -99.2000,
    latitud: 19.3900
  },
  {
    _id: "BIEN-GEO-06",
    producto: "comercio",
    estado: "vigente",
    sumaAsegurada: 2750000,
    longitud: -99.1300,
    latitud: 19.5000
  }
];

var zonasFuente = [
  {
    _id: "ZONA-GEO-01",
    categoria: "inundacion_centro",
    vigencia: "2026",
    vertices: [
      [-99.1500, 19.4200],
      [-99.1100, 19.4200],
      [-99.1100, 19.4500],
      [-99.1500, 19.4500],
      [-99.1500, 19.4200]
    ]
  },
  {
    _id: "ZONA-GEO-02",
    categoria: "exposicion_poniente",
    vigencia: "2026",
    vertices: [
      [-99.1900, 19.4000],
      [-99.1400, 19.4000],
      [-99.1400, 19.4400],
      [-99.1900, 19.4400],
      [-99.1900, 19.4000]
    ]
  },
  {
    _id: "ZONA-GEO-03",
    categoria: "exposicion_norte",
    vigencia: "2026",
    vertices: [
      [-99.1550, 19.4700],
      [-99.1050, 19.4700],
      [-99.1050, 19.5100],
      [-99.1550, 19.5100],
      [-99.1550, 19.4700]
    ]
  }
];

curso.bienes_geo_fuente.insertMany(bienesFuente);
curso.zonas_riesgo_fuente.insertMany(zonasFuente);

curso.bienes_geo.insertMany(bienesFuente.map(function (bien) {
  return {
    _id: bien._id,
    producto: bien.producto,
    estado: bien.estado,
    sumaAsegurada: bien.sumaAsegurada,
    ubicacion: {
      type: "Point",
      coordinates: [bien.longitud, bien.latitud]
    }
  };
}));

curso.zonas_riesgo.insertMany(zonasFuente.map(function (zona) {
  return {
    _id: zona._id,
    categoria: zona.categoria,
    vigencia: zona.vigencia,
    geometria: {
      type: "Polygon",
      coordinates: [zona.vertices]
    }
  };
}));

curso.siniestros_geo.insertMany([
  {
    _id: "SIN-GEO-01",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 80000,
    ubicacion: { type: "Point", coordinates: [-99.1400, 19.4300] }
  },
  {
    _id: "SIN-GEO-02",
    tipoEvento: "inundacion",
    estado: "cerrado",
    montoReclamado: 120000,
    ubicacion: { type: "Point", coordinates: [-99.1200, 19.4400] }
  },
  {
    _id: "SIN-GEO-03",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 45000,
    ubicacion: { type: "Point", coordinates: [-99.1300, 19.4250] }
  },
  {
    _id: "SIN-GEO-04",
    tipoEvento: "inundacion",
    estado: "en_revision",
    montoReclamado: 60000,
    ubicacion: { type: "Point", coordinates: [-99.1150, 19.4450] }
  },
  {
    _id: "SIN-GEO-05",
    tipoEvento: "incendio",
    estado: "cerrado",
    montoReclamado: 150000,
    ubicacion: { type: "Point", coordinates: [-99.1750, 19.4150] }
  },
  {
    _id: "SIN-GEO-06",
    tipoEvento: "inundacion",
    estado: "cerrado",
    montoReclamado: 210000,
    ubicacion: { type: "Point", coordinates: [-99.2050, 19.3900] }
  },
  {
    _id: "SIN-GEO-07",
    tipoEvento: "colision",
    estado: "cerrado",
    montoReclamado: 52000,
    ubicacion: { type: "Point", coordinates: [-99.1000, 19.4650] }
  },
  {
    _id: "SIN-GEO-08",
    tipoEvento: "incendio",
    estado: "cerrado",
    montoReclamado: 95000,
    ubicacion: { type: "Point", coordinates: [-99.1250, 19.4850] }
  }
]);

var cantidades = {
  bienesFuente: curso.bienes_geo_fuente.countDocuments({}),
  zonasFuente: curso.zonas_riesgo_fuente.countDocuments({}),
  bienesGeo: curso.bienes_geo.countDocuments({}),
  zonasRiesgo: curso.zonas_riesgo.countDocuments({}),
  siniestrosGeo: curso.siniestros_geo.countDocuments({})
};

if (
  cantidades.bienesFuente !== 6 ||
  cantidades.zonasFuente !== 3 ||
  cantidades.bienesGeo !== 6 ||
  cantidades.zonasRiesgo !== 3 ||
  cantidades.siniestrosGeo !== 8
) {
  throw new Error("La carga de la semana 3 no produjo las cantidades esperadas.");
}

print("Datos sintéticos de la semana 3 cargados en m6_nosql.");
printjson(cantidades);

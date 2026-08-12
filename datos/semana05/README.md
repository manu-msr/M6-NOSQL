# Datos de la semana 5

Los ejemplos 17 a 20 comparten tres colecciones sintéticas en `m6_nosql`:

- `avisos_texto`: siete avisos con texto libre y códigos controlados;
- `casos_protegidos`: cuatro casos con datos operativos, financieros e
  identificadores ficticios;
- `evidencias_protegidas`: tres referencias sintéticas asociadas con casos.

La carga restablece únicamente esas colecciones y elimina la vista
`casos_analitica` para que cada demostración parta del mismo estado:

```bash
cd ~/m6-nosql
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana05/cargar_datos_semana05.js
```

La verificación se ejecuta con:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana05/verificar_datos_semana05.js
```

Los nombres, correos, teléfonos, identificadores, descripciones y montos son
ficticios. Los dominios `.invalid` no representan direcciones utilizables. La
clasificación y las transformaciones son didácticas: no certifican anonimato,
seguridad ni cumplimiento normativo.

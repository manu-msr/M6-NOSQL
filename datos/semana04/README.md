# Datos de la semana 4

Los ejemplos 13 a 16 comparten datos sintéticos en la base `m6_nosql`:

- `exposicion_temporal_fuente`: seis observaciones mensuales antes de modelar;
- `exposicion_temporal`: las mismas observaciones con `periodo` de tipo BSON
  `Date`, metadatos de serie y granularidad explícita;
- `movimientos_temporales`: ocho eventos irregulares con tiempo de ocurrencia y
  tiempo de registro;
- `siniestros_temporales`: diez eventos para agregación, incluidos dos que no
  forman parte de la serie analizada.

La carga es repetible y restablece únicamente estas cuatro colecciones:

```bash
cd ~/m6-nosql
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana04/cargar_datos_semana04.js
```

La verificación estructural se ejecuta con:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana04/verificar_datos_semana04.js
```

Los registros, identificadores y montos son ficticios. La frecuencia de los
ejemplos 15 y 16 usa `polizasExpuestas` como denominador didáctico. No representa
una metodología actuarial completa ni permite inferir causalidad.

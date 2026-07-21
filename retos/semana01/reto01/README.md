[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../../../ejemplos/semana01/README.md) > `Reto 01`

## Reto 01: Configurar la instancia y comprobar una consulta

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Preparar el entorno individual dentro de AWS Academy Learner Lab.
- Comprobar que MongoDB y la base `m6_nosql` estén disponibles.
- Completar y ejecutar una consulta breve sobre la colección `siniestros`.
- Conservar evidencia de que la instancia quedó lista para trabajar.

### 2. Requisitos :clipboard:

1. Haber observado los ejemplos 01 y 02.
2. Tener acceso al Learner Lab y a su terminal integrada.
3. Consultar el
   [manual de configuración](../../../docs/inicio_learner_lab.md).

> Si el Learner Lab todavía no está disponible en tu cuenta, no instales las
> herramientas en tu computadora personal. Conserva el mensaje que aparece y
> comunícalo al docente.

### 3. Desarrollo :rocket:

#### Parte A. Entrar al repositorio

Inicia el Learner Lab y abre su terminal integrada. Si es la primera vez que
entras, ejecuta una línea a la vez:

```bash
cd ~
git clone https://github.com/manu-msr/M6-NOSQL.git m6-nosql
cd m6-nosql
pwd
```

La ruta mostrada por `pwd` debe terminar en `/m6-nosql`.

Si el repositorio ya existe, actualízalo en lugar de volver a clonarlo:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
```

#### Parte B. Configurar y comprobar MongoDB

Desde la raíz del repositorio, ejecuta:

```bash
bash setup/setup.sh
```

Espera hasta encontrar el mensaje:

```text
Preparación completa. MongoDB está activo y la base m6_nosql está poblada.
```

Abre la consola:

```bash
bash setup/conectar.sh
```

Cuando aparezca el indicador `m6_nosql>`, ejecuta:

```javascript
db.getName()
db.runCommand({ ping: 1 })
show collections
db.siniestros.countDocuments({})
```

Comprueba que la base sea `m6_nosql`, que el resultado de `ping` incluya
`ok: 1`, que aparezca la colección `siniestros` y que ésta contenga diez
documentos. Escribe `exit` para regresar a Bash.

#### Parte C. Completar una consulta corta

Crea una copia editable de la plantilla:

```bash
cp retos/semana01/reto01/plantilla_consultas.js \
  retos/semana01/reto01/consultas_reto01.js
cp retos/semana01/reto01/plantilla_respuestas.md \
  retos/semana01/reto01/respuestas_reto01.md
nano retos/semana01/reto01/consultas_reto01.js
```

Completa una consulta que:

1. recupere únicamente siniestros con estado `en_revision`;
2. muestre `_id`, `polizaId` y `montoReclamado`;
3. ordene el monto de mayor a menor y utilice `_id` como desempate ascendente;
4. limite la salida a los dos primeros documentos.

En `nano`, guarda con `Ctrl+O`, confirma con `Enter` y cierra con `Ctrl+X`.

#### Parte D. Ejecutar y revisar

Ejecuta tu archivo desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana01/reto01/consultas_reto01.js
```

La salida debe contener dos documentos y no debe mostrar errores. Registra los
identificadores obtenidos y explica en una oración por qué aparecen en ese
orden. Abre el archivo de respuestas con:

```bash
nano retos/semana01/reto01/respuestas_reto01.md
```

Completa los espacios de la
[`plantilla_respuestas.md`](plantilla_respuestas.md), guarda y cierra el editor.

#### Producto breve esperado

Entrega únicamente:

- `consultas_reto01.js` con la consulta ejecutable;
- `respuestas_reto01.md` con los dos identificadores y una interpretación;
- una captura donde se observe la ejecución correcta de la consulta.

No incluyas contraseñas, llaves, certificados ni datos de tu cuenta.

#### Criterios de revisión

- La instancia quedó configurada y la base responde.
- El filtro, la proyección, el orden y el límite cumplen la consigna.
- La consulta se ejecuta sin errores y devuelve dos documentos.
- La interpretación explica brevemente el orden observado.

<br/>

[`Anterior`](../../../ejemplos/semana01/ejemplo02/README.md) | [`Siguiente`](../../../ejemplos/semana01/ejemplo03/README.md)

</div>

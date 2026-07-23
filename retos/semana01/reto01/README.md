[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../../../ejemplos/semana01/README.md) > `Reto 01`

## Reto 01: Configurar la instancia y comprobar una consulta

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Preparar el entorno individual dentro de AWS Academy Learner Lab.
- Comprobar que MongoDB y la base `m6_nosql` estén disponibles.
- Construir y ejecutar una consulta breve sobre la colección `siniestros`.
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

Cuando aparezca el indicador `m6_nosql>` o `>`, ejecuta:

```javascript
db.getName()
db.runCommand({ ping: 1 })
show collections
db.siniestros.countDocuments({})
```

Comprueba que la base sea `m6_nosql`, que el resultado de `ping` incluya
`ok: 1`, que aparezca la colección `siniestros` y que ésta contenga diez
documentos. Mantén abierta la consola para resolver la consulta.

#### Parte C. Construir la consulta en la consola

Trabaja directamente en el indicador `m6_nosql>` o `>`. El objetivo es
construir una consulta que:

1. recupere únicamente siniestros con estado `en_revision`;
2. muestre `_id`, `polizaId` y `montoReclamado`;
3. ordene el monto de mayor a menor y utilice `_id` como desempate ascendente;
4. limite la salida a los dos primeros documentos.

No intentes escribir todo de una sola vez. Comienza sólo con `find()` y el
filtro de estado, ejecuta la consulta y comprueba qué documentos continúan.
Después recupera la instrucción con la tecla de flecha hacia arriba y añade una
decisión a la vez:

1. la proyección de los tres campos solicitados;
2. el orden descendente por monto y el desempate ascendente;
3. el límite de dos documentos;
4. `.toArray()` para observar el resultado como una lista completa.

Ejecuta la consulta después de cada cambio. La cantidad y la forma de los
documentos intermedios permiten localizar un error antes de seguir. La consulta
final debe devolver exactamente dos documentos y no mostrar campos distintos a
los solicitados.

Registra temporalmente los dos identificadores y observa el orden en el que
aparecen. Cuando la consulta esté comprobada, recupérala con la tecla de flecha
hacia arriba, selecciónala y utiliza la opción **Copiar** del menú contextual
de la terminal. Después escribe `exit` para regresar a Bash.

#### Parte D. Conservar la consulta comprobada

El razonamiento y las pruebas ya se realizaron en la consola. Ahora crea los
archivos de evidencia:

```bash
cp retos/semana01/reto01/plantilla_consultas.js \
  retos/semana01/reto01/consultas_reto01.js
cp retos/semana01/reto01/plantilla_respuestas.md \
  retos/semana01/reto01/respuestas_reto01.md
nano retos/semana01/reto01/consultas_reto01.js
```

En la plantilla, reemplaza `null` por la consulta final que ya comprobaste,
incluido `.toArray()`. No necesitas diseñar un programa nuevo: el archivo
`.js` es únicamente una forma de conservar y volver a ejecutar la consulta.
Pega la instrucción que copiaste antes de cerrar la consola.

En `nano`, guarda con `Ctrl+O`, confirma con `Enter` y cierra con `Ctrl+X`.
Si aparece `nano: command not found`, conserva el mensaje y comunícalo al
docente antes de utilizar otro editor.

Ejecuta el archivo desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana01/reto01/consultas_reto01.js
```

La salida debe coincidir con la obtenida en la consola. Si no coincide, regresa
a la consulta que sí funcionó y revisa que la hayas copiado completa.

Abre el archivo de respuestas:

```bash
nano retos/semana01/reto01/respuestas_reto01.md
```

Registra los dos identificadores y explica en una oración por qué aparecen en
ese orden. Guarda y cierra el editor.

#### Producto breve esperado

Entrega únicamente:

- `consultas_reto01.js` con la consulta que comprobaste en la consola;
- `respuestas_reto01.md` con los dos identificadores y una interpretación;
- una captura donde se observe la ejecución correcta de la consulta.

No incluyas contraseñas, llaves, certificados ni datos de tu cuenta.

#### Criterios de revisión

- La instancia quedó configurada y la base responde.
- La consulta se construyó y verificó progresivamente en la consola.
- El filtro, la proyección, el orden y el límite cumplen la consigna.
- El archivo conserva la consulta ejecutable y devuelve dos documentos.
- La interpretación explica brevemente el orden observado.

<br/>

[`Anterior`](../../../ejemplos/semana01/ejemplo02/README.md) | [`Siguiente`](../../../ejemplos/semana01/ejemplo03/README.md)

</div>

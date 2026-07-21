# Reto 04: construir y probar reglas de validación

## 1. Objetivo

Construir un validador para una colección de siniestros y demostrar su
funcionamiento mediante documentos válidos e inválidos.

## 2. Requisitos

- Haber revisado la Nota 04 y las demostraciones de los ejemplos 07 y 08.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la carpeta `repositorio`.

## 3. Situación

La colección `siniestros_validacion_reto` recibirá documentos con estos
requisitos:

- `_id` y `polizaId` son cadenas obligatorias;
- `fechaOcurrencia` es una fecha BSON obligatoria;
- `montoReclamado` es numérico, obligatorio y no negativo;
- `estado` es obligatorio y admite `en_revision`, `cerrado` o `rechazado`;
- `coberturasAfectadas` es un arreglo obligatorio, contiene al menos una clave y
  cada elemento es una cadena;
- `aviso` es opcional; si aparece, debe ser un documento con:
  - `canal`, uno de `portal`, `app`, `agente` o `telefono`;
  - `diasDespues`, un entero no negativo.

La regla se incorporará a una colección ya creada mediante `collMod`, con nivel
`strict` y acción `error`.

## 4. Preparar la colección

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql/repositorio
pwd
bash retos/semana02/reto04/scripts/cargar_datos.sh
```

`pwd` debe terminar en `/m6-nosql/repositorio`. El lanzador crea una colección
vacía, sin validador, para que la regla se incorpore durante el reto.

La preparación puede comprobarse con:

```bash
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>`, se ejecuta:

```javascript
db.getCollectionInfos({ name: "siniestros_validacion_reto" })[0].options
```

La salida inicial no debe contener `validator`. `exit` cierra la consola.

## 5. Preparar los archivos de trabajo

Desde la raíz de `repositorio`:

```bash
cp retos/semana02/reto04/plantilla_validador.js \
  retos/semana02/reto04/validador_reto04.js
cp retos/semana02/reto04/plantilla_respuestas.md \
  retos/semana02/reto04/respuestas_reto04.md
```

El validador se abre con:

```bash
nano retos/semana02/reto04/validador_reto04.js
```

En `nano`, `Ctrl+O` guarda, `Enter` confirma el nombre y `Ctrl+X` cierra. El
mismo procedimiento se usa con `respuestas_reto04.md`. Si aparece
`nano: command not found`, se conserva el mensaje y se comunica al docente antes
de utilizar otro editor.

## 6. Consigna del validador

En `validador_reto04.js` se completa únicamente el objeto `esquema`. Debe usar
las palabras clave estudiadas en la Nota 04 para representar todos los
requisitos de la situación:

1. tipo del documento raíz;
2. campos obligatorios;
3. tipos de identificadores, fecha y monto;
4. mínimo del monto;
5. dominio de `estado`;
6. tipo, longitud mínima y elementos de `coberturasAfectadas`;
7. subesquema del campo opcional `aviso` y sus restricciones internas.

La plantilla aplica el esquema mediante `collMod`, elimina los documentos de una
ejecución anterior y realiza ocho pruebas sin modificar sus casos.

## 7. Ejecutar y comprobar

Desde la raíz de `repositorio`:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana02/reto04/validador_reto04.js
```

La salida esperada acepta dos documentos y rechaza los otros seis. La colección
debe terminar con exactamente dos documentos almacenados.

Si aparece `ECONNREFUSED` o la colección no existe, se repite:

```bash
bash setup/setup.sh
bash retos/semana02/reto04/scripts/cargar_datos.sh
```

## 8. Interpretación requerida

En `respuestas_reto04.md` se registra para cada documento de prueba:

- si fue aceptado o rechazado;
- la regla específica que explica el resultado;
- la diferencia entre ausencia de `aviso` y presencia de un `aviso` incompleto;
- la diferencia entre declarar un campo en `required` y definirlo en
  `properties`;
- la cantidad final de documentos y la evidencia usada para comprobarla.

No se utiliza el texto completo del error como única explicación: el análisis
debe relacionar cada caso con la regla declarada.

## 9. Producto breve esperado

La entrega contiene solamente:

- `validador_reto04.js`, ejecutable y con el esquema completo;
- `respuestas_reto04.md`, con la interpretación solicitada;
- evidencia pertinente donde sean visibles las ocho pruebas y la cantidad
  final de documentos.

No se requiere un reporte extenso ni se incluyen datos personales reales.

## 10. Criterios de revisión

- El esquema representa todos los requisitos sin volver obligatorio `aviso`.
- Los tipos BSON, dominios y mínimos son correctos.
- El arreglo y el documento anidado tienen subesquemas adecuados.
- Las dos pruebas válidas se aceptan y las seis inválidas se rechazan.
- La interpretación identifica la regla responsable de cada resultado.
- La evidencia es reproducible y no depende del texto interno completo del
  mensaje de error.

## 11. Relación con los ejemplos

- El Ejemplo 07 separa presencia, tipo y mínimo en un siniestro.
- El Ejemplo 08 muestra arreglos, subesquemas y opcionalidad.
- El reto integra esas reglas y las aplica mediante `collMod` a otra colección.

## Compatibilidad

El reto se ejecuta y evalúa sobre MongoDB Community 7.0. No se presupone que
Amazon DocumentDB admita la misma configuración o devuelva el mismo detalle de
errores; cualquier traslado requiere verificación independiente.

## Nota docente

La carpeta `solucion_docente` se mantiene fuera de la versión del repositorio
que se distribuya al estudiantado.

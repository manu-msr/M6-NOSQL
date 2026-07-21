# Ejemplo 07: validar los campos indispensables de un siniestro

## 1. Objetivos

- Crear una colección con un validador basado en `$jsonSchema`.
- Diferenciar presencia mediante `required` y tipo mediante `bsonType`.
- Restringir un monto a valores no negativos.
- Comprobar la regla con una escritura válida y varias escrituras inválidas.

## 2. Requisitos

- Haber revisado la Nota 04.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la carpeta `repositorio`.

## 3. Contexto del problema

Un siniestro no puede participar de forma confiable en las consultas principales
si carece del identificador de su póliza, de la fecha de ocurrencia o del monto
reclamado. La demostración convierte esas condiciones mínimas en reglas que el
motor puede comprobar al escribir.

## 4. Datos utilizados

El script crea de nuevo la colección independiente
`siniestros_validados_ejemplo`. No modifica la colección base `siniestros`.
Todos los documentos de prueba son sintéticos.

## 5. Ejecución de la demostración

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql/repositorio
pwd
bash ejemplos/semana02/ejemplo07/scripts/ejecutar.sh
```

El lanzador ejecuta
[`consultas/validar_siniestro.js`](consultas/validar_siniestro.js) después de
comprobar que MongoDB esté activo.

## 6. Desarrollo guiado

### Paso 1. Definir la estructura raíz

`bsonType: "object"` indica que la regla se aplica a documentos. `required`
exige `_id`, `polizaId`, `fechaOcurrencia` y `montoReclamado`.

### Paso 2. Asociar reglas a los campos

`properties` establece que los identificadores sean cadenas, la fecha sea un
valor BSON `date` y el monto use un tipo numérico admitido. `minimum: 0` evita
montos negativos. `estado` es opcional, pero si aparece debe pertenecer al
conjunto acordado.

### Paso 3. Aplicar la regla a una colección

La colección se crea con `validationLevel: "strict"` y
`validationAction: "error"`. Las escrituras evaluadas que incumplan el esquema
son rechazadas.

### Paso 4. Ejecutar pruebas controladas

El script intenta insertar un documento completo, otro sin `polizaId`, otro con
la fecha como cadena y otro con monto negativo. Cada prueba anuncia si fue
aceptada o rechazada sin depender del texto detallado del error.

## 7. Resultado esperado

- El documento `VAL-SIN-01` es aceptado.
- `VAL-SIN-02` es rechazado porque falta `polizaId`.
- `VAL-SIN-03` es rechazado porque la fecha es una cadena.
- `VAL-SIN-04` es rechazado porque el monto es negativo.
- La colección termina con un documento almacenado.

## 8. Interpretación

`required` y `properties` cumplen funciones complementarias: una regla controla
que el campo exista y la otra controla el valor que aparece. La validación
protege condiciones explícitas del modelo; no demuestra que el siniestro sea
real, que el monto sea correcto ni que la póliza referida exista.

## 9. Relación con el Reto 04

El reto combina campos obligatorios, dominios, arreglos y un documento anidado
opcional. También solicita documentar qué regla explica cada resultado de prueba.

## Compatibilidad

La demostración está diseñada y comprobada para MongoDB Community 7.0. No se
asume que el mismo validador o sus mensajes de error tengan comportamiento
idéntico en Amazon DocumentDB; la capacidad debe verificarse antes de trasladarlo.

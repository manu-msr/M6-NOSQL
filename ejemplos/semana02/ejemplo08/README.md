# Ejemplo 08: validar arreglos y documentos anidados

## 1. Objetivos

- Aplicar un subesquema a cada elemento de un arreglo.
- Exigir al menos una cobertura mediante `minItems`.
- Validar un documento anidado cuando un campo opcional está presente.
- Distinguir la ausencia válida de un campo opcional de una estructura presente
  pero inválida.

## 2. Requisitos

- Haber revisado la Nota 04 y el Ejemplo 07.
- Continuar en la terminal integrada del Learner Lab con el repositorio
  `https://github.com/manu-msr/M6-NOSQL` ya clonado.
- Haber ejecutado `bash setup/setup.sh` desde la raíz del repositorio.

## 3. Contexto del problema

Una póliza debe contener al menos una cobertura. Cada elemento necesita una
clave y un límite no negativo. Algunas pólizas incluyen además una persona
beneficiaria; ese campo puede omitirse, pero si aparece debe contener
`personaId` y `parentesco` como cadenas.

## 4. Datos utilizados

El script crea nuevamente la colección independiente
`polizas_validadas_ejemplo`. Las cinco escrituras de prueba son sintéticas y no
modifican la colección base `polizas`.

## 5. Ejecución de la demostración

Desde la terminal Bash del Learner Lab:

```bash
cd ~/m6-nosql
pwd
bash ejemplos/semana02/ejemplo08/scripts/ejecutar.sh
```

El lanzador ejecuta
[`consultas/validar_arreglos_anidados.js`](consultas/validar_arreglos_anidados.js).

## 6. Desarrollo guiado

### Paso 1. Validar el arreglo como conjunto

`coberturas` debe ser un arreglo y `minItems: 1` evita listas vacías. Esta regla
no describe todavía la forma de cada elemento.

### Paso 2. Validar cada cobertura

`items` contiene un subesquema de objeto. Cada cobertura requiere `clave` y
`limite`; el límite debe ser numérico y no negativo. Todos los elementos deben
satisfacer el mismo subesquema.

### Paso 3. Conservar una variación legítima

`beneficiario` no aparece en el `required` de la póliza. Su ausencia es válida.
Cuando está presente, debe ser un objeto con `personaId` y `parentesco`.

### Paso 4. Contrastar las pruebas

Se aceptan una póliza sin beneficiario y otra con un beneficiario completo. Se
rechazan un arreglo vacío, una cobertura sin límite y un beneficiario presente
pero incompleto.

## 7. Resultado esperado

- `VAL-POL-01` y `VAL-POL-02` son aceptadas.
- `VAL-POL-03` es rechazada porque `coberturas` está vacío.
- `VAL-POL-04` es rechazada porque un elemento no contiene `limite`.
- `VAL-POL-05` es rechazada porque `beneficiario` no contiene `parentesco`.
- La colección termina con dos documentos.

## 8. Interpretación

La regla del arreglo se aplica a cada elemento, no sólo al primero. La
opcionalidad se decide en el nivel de la póliza: omitir `beneficiario` es válido,
pero incluirlo activa las reglas de su subesquema. El validador protege la forma
y algunas restricciones locales; no comprueba por sí mismo la suficiencia de
las coberturas ni la identidad real de una persona.

## 9. Relación con el Reto 04

El reto traslada estas decisiones a documentos de siniestros y solicita construir
el validador, ejecutar casos positivos y negativos e interpretar cada rechazo.

## Compatibilidad

El ejemplo se ejecuta sobre MongoDB Community 7.0. Las capacidades de validación
y el detalle de los errores deben comprobarse por separado antes de trasladar la
solución a Amazon DocumentDB.

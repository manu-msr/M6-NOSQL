[`Conceptos avanzados de bases de datos NoSQL`](../../README.md) > `Semana 02`

# Semana 02: Rendimiento y calidad de los datos

<div style="text-align: justify;">

Durante esta semana utilizaremos índices para reducir el trabajo de consultas
frecuentes y reglas de validación para proteger la calidad de los documentos.
Primero compararemos planes de ejecución antes y después de indexar. Después
traduciremos requisitos del modelo a un esquema verificable y probaremos casos
válidos e inválidos. En ambos temas, la decisión deberá justificarse con
evidencia observable y no sólo con la sintaxis utilizada.

## 1. Objetivo :dart:

- Relacionar los índices con los patrones completos de consulta.
- Interpretar planes de ejecución y métricas de trabajo.
- Reconocer los beneficios y costos de los índices.
- Construir reglas de validación mediante JSON Schema.
- Distinguir presencia, tipo, dominio, arreglos y estructuras opcionales.
- Comprobar cada decisión con resultados reproducibles.

## 2. Sesión 4: Indexación y rendimiento :zap:

Al comenzar el Ejemplo 05 actualizarás la copia del repositorio mediante
`git pull --ff-only`. Después recuperaremos la comparación controlada que
seguiremos durante toda la sesión: mantener fija una consulta, cambiar la
estructura disponible y volver a medir.

---

### <ins>Comparación antes y después de indexar</ins>

Observaremos el plan de una consulta de pólizas por estado y fecha. Primero
identificaremos el recorrido de colección y sus métricas; después crearemos un
índice que corresponda con el patrón y repetiremos exactamente la misma
consulta. La respuesta lógica deberá conservarse mientras cambia el trabajo
registrado por el motor.

- [**`EJEMPLO 05`**](ejemplo05/README.md)

---

### <ins>Filtros, ordenamiento y prefijos</ins>

Construiremos un índice compuesto para dos condiciones de igualdad y un
ordenamiento por fecha. Leeremos el plan para comprobar si el índice entrega el
orden solicitado y observaremos cuándo otra consulta puede aprovechar su
prefijo. La demostración terminará separando la utilidad del índice de sus
costos de escritura y almacenamiento.

- [**`EJEMPLO 06`**](ejemplo06/README.md)
- [**`RETO 03`**](../../retos/semana02/reto03/README.md)

---

## 3. Sesión 5: Validación y control de esquemas :shield:

Al comenzar el Ejemplo 07 volverás a actualizar el repositorio. Conservaremos la
flexibilidad del modelo documental, pero expresaremos las condiciones mínimas
que deben satisfacer los documentos nuevos o modificados.

---

### <ins>Campos indispensables y restricciones</ins>

Crearemos una colección de siniestros con un validador basado en JSON Schema.
Separaremos los campos obligatorios de las reglas aplicadas a sus valores y
comprobaremos presencia, tipo BSON, dominio y mínimo numérico mediante
escrituras controladas.

- [**`EJEMPLO 07`**](ejemplo07/README.md)

---

### <ins>Arreglos, documentos anidados y opcionalidad</ins>

Ampliaremos el esquema para validar cada elemento de un arreglo de coberturas y
un documento anidado opcional. Compararemos la ausencia válida de un campo con
la presencia de una estructura incompleta y relacionaremos cada aceptación o
rechazo con una regla concreta.

- [**`EJEMPLO 08`**](ejemplo08/README.md)
- [**`RETO 04`**](../../retos/semana02/reto04/README.md)

---

[`← Semana 01`](../semana01/README.md) | [`Regresar al inicio`](../../README.md)

</div>

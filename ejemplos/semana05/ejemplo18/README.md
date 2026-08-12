[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../README.md) > `Ejemplo 18`

## Ejemplo 18: Localizar y clasificar patrones con expresiones regulares

<div style="text-align: justify;">

### 1. Objetivo :dart:

Construir expresiones regulares para prefijos y estructuras completas, observar
el efecto de las anclas y la sensibilidad a mayúsculas, combinar filtros y
categorizar códigos sin atribuir significado que el patrón no demuestra.

### 2. Requisitos :clipboard:

- Haber actualizado el repositorio al comenzar el Ejemplo 17.
- Mantener MongoDB activo y los datos de la semana 5 cargados.
- Continuar en `~/m6-nosql`.

### 3. Desarrollo :rocket:

Abre la consola si es necesario:

```bash
bash setup/conectar.sh
```

#### Crear un índice escalar sobre el código

```javascript
db.avisos_texto.createIndex(
  { codigo: 1 },
  { name: "codigo_asc" }
)
```

El índice de texto del ejemplo anterior atiende términos. Un código usa una
relación diferente: queremos reconocer su forma de caracteres.

#### Contrastar un patrón abierto con un prefijo

```javascript
db.avisos_texto.find(
  { codigo: /AUT/ },
  { codigo: 1 }
).sort({ _id: 1 }).toArray()
```

Esta consulta devuelve `AV-TXT-01`, `AV-TXT-02`, `AV-TXT-06` y
`AV-TXT-07`, porque acepta `AUT` en cualquier posición. Agrega el ancla inicial:

```javascript
db.avisos_texto.find(
  { codigo: /^AUT-/ },
  { codigo: 1 }
).sort({ _id: 1 }).toArray()
```

Ahora quedan sólo los tres códigos que comienzan con `AUT-`; `REP-AUT-004`
queda fuera.

#### Exigir una estructura completa

```javascript
db.avisos_texto.find(
  { codigo: /^HOG-[A-Z]{3,4}-[0-9]{3}$/ },
  { codigo: 1 }
).sort({ _id: 1 }).toArray()
```

Las dos anclas, las clases y los cuantificadores recuperan `HOG-CDMX-001` y
`HOG-PUE-002`. El patrón confirma una forma, no la existencia de la región ni la
validez del aviso en otro sistema.

#### Comparar mayúsculas y signos diacríticos

```javascript
db.avisos_texto.find(
  { descripcion: /inundación/ },
  { descripcion: 1 }
).toArray()

db.avisos_texto.find(
  { descripcion: /inundación/i },
  { descripcion: 1 }
).toArray()
```

La primera devuelve `AV-TXT-03`; la segunda también acepta la variante en
mayúsculas de `AV-TXT-02`. La opción `i` no permite asumir que una palabra sin
acento equivale a la misma palabra acentuada.

#### Combinar condiciones

```javascript
db.avisos_texto.find(
  {
    producto: "Auto",
    estado: "abierto",
    descripcion: /granizo|piedra/i
  },
  { producto: 1, estado: 1, descripcion: 1 }
).sort({ _id: 1 }).toArray()
```

El resultado contiene `AV-TXT-01` y `AV-TXT-06`. Cada documento satisface las
tres condiciones; el patrón no explica lo decidido por producto y estado.

#### Categorizar con reglas ordenadas

```javascript
db.avisos_texto.aggregate([
  {
    $project: {
      codigo: 1,
      categoriaCalculada: {
        $switch: {
          branches: [
            {
              case: { $regexMatch: { input: "$codigo", regex: /^AUT-/ } },
              then: "auto"
            },
            {
              case: { $regexMatch: { input: "$codigo", regex: /^HOG-/ } },
              then: "hogar"
            },
            {
              case: { $regexMatch: { input: "$codigo", regex: /^VID-/ } },
              then: "vida"
            }
          ],
          default: "revision_manual"
        }
      }
    }
  },
  { $sort: { _id: 1 } }
]).toArray()
```

`AV-TXT-07` queda en `revision_manual`: contiene `AUT`, pero no inicia con el
prefijo gobernado. El caso predeterminado evita ocultar valores no reconocidos.

#### Observar el plan y recapitular

```javascript
db.avisos_texto.find({ codigo: /^AUT-/ }).explain("executionStats")
```

Después de comprobar el procedimiento, ejecuta la recapitulación:

```bash
exit
bash ejemplos/semana05/ejemplo18/scripts/ejecutar.sh
```

### 4. Interpretación :mag:

Una regex literal, anclada y sensible a mayúsculas ofrece al motor más
información que un patrón abierto o insensible. La selectividad y el plan real
siguen siendo parte de la evidencia. En Amazon DocumentDB, el aprovechamiento
de un índice por regex y el uso de `hint()` deben verificarse en la versión
objetivo.

### 5. Relación con el Reto 09 :link:

El reto solicita elegir entre una pregunta sobre términos y una pregunta sobre
la forma de códigos. La justificación debe partir de la relación buscada, no de
la flexibilidad aparente del operador.

[`Ejemplo 17`](../ejemplo17/README.md) | [`Reto 09 →`](../../../retos/semana05/reto09/README.md)

</div>

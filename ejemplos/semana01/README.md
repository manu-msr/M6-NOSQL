[`Conceptos avanzados de bases de datos NoSQL`](../../README.md) > `Semana 01`

# Semana 01: Documentos, consultas y agregaciones

<div style="text-align: justify;">

Durante esta semana recuperaremos las bases del modelo documental y las
consultas en MongoDB. Primero observaremos una demostración del entorno de
trabajo y repasaremos consultas directas sobre pólizas y siniestros. Después
configurarás tu propia instancia y comprobarás su funcionamiento con un
ejercicio corto. La segunda sesión introducirá los pipelines de agregación.

## 1. Objetivo :dart:

- Representar información mediante documentos, estructuras anidadas y arreglos.
- Reconocer y preparar el entorno técnico utilizado durante el módulo.
- Construir consultas con filtros, proyecciones, ordenamientos y límites.
- Interpretar las transformaciones de un pipeline de agregación.
- Relacionar cada operación con la pregunta que se desea responder.

## 2. Sesión 1: Modelo documental y consultas :blue_book:

---

### <ins>Recorrido por el entorno de trabajo</ins>

El docente mostrará cómo entrar al Learner Lab, reconocer la terminal, obtener
el repositorio, ejecutar la configuración y abrir la consola de MongoDB. La
demostración terminará verificando la base `m6_nosql`, sus colecciones y la
estructura de un documento. Durante este ejemplo sólo necesitas observar el
recorrido y distinguir los comandos de Bash de las instrucciones de la consola
de MongoDB.

- [**`EJEMPLO 01`**](ejemplo01/README.md)

---

### <ins>Repaso de consultas sobre documentos</ins>

Consultaremos campos simples, documentos anidados y arreglos. También
distinguiremos el filtro que selecciona documentos de la proyección que
controla la respuesta, y aplicaremos ordenamientos y límites. Esto permitirá
formular preguntas concretas sobre los siniestros y devolver únicamente los
campos necesarios, en un orden útil para su revisión. También será una
demostración ejecutada por el docente.

- [**`EJEMPLO 02`**](ejemplo02/README.md)
- [**`RETO 01`**](../../retos/semana01/reto01/README.md)

---

## 3. Sesión 2: Framework de agregación :gear:

---

### <ins>Pipeline como secuencia de transformaciones</ins>

Leeremos un pipeline como un flujo de documentos. Con `$match` seleccionaremos
los casos relevantes, con `$project` prepararemos la forma de la salida y con
`$sort` estableceremos el orden del resultado. Seguiremos lo que recibe y
produce cada etapa para comprender por qué el orden de las transformaciones
influye en la respuesta final.

- [**`EJEMPLO 03`**](ejemplo03/README.md)

---

### <ins>Relación, descomposición y agrupación</ins>

Relacionaremos siniestros y pólizas mediante `$lookup`, descompondremos arreglos
con `$unwind` y construiremos resúmenes con `$group`. El resultado permitirá
describir la frecuencia y el monto reclamado por producto y cobertura. Además,
observaremos cómo cambia la unidad de análisis durante el pipeline: de un
siniestro completo a registros por cobertura y, finalmente, a grupos
resumidos.

- [**`EJEMPLO 04`**](ejemplo04/README.md)
- [**`RETO 02`**](../../retos/semana01/reto02/README.md)

---

[`← Regresar`](../../README.md) | [`Semana 02 →`](../semana02/README.md)

</div>

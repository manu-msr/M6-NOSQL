#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos base..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/cargar_datos_base.js"
echo "2/2 Ejecutando el Ejemplo 06..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana02/ejemplo06/consultas/indice_compuesto_filtro_orden.js"

#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Preparando los datos de la demostración..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/cargar_datos_base.js"
echo "2/2 Recorriendo la base y sus colecciones..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana01/ejemplo01/consultas/recorrer_entorno.js"

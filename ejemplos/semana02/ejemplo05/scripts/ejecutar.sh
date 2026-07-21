#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos base..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/cargar_datos_base.js"
echo "2/2 Comparando la consulta antes y después de indexar..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana02/ejemplo05/consultas/comparar_antes_despues.js"

#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos de la semana 4..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/semana04/cargar_datos_semana04.js"
echo "2/2 Consultando el historial temporal..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana04/ejemplo14/consultas/consultar_historial_temporal.js"

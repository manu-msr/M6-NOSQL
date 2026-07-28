#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos geoespaciales de la semana 3..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/semana03/cargar_datos_semana03.js"
echo "2/2 Representando bienes mediante puntos GeoJSON..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana03/ejemplo09/consultas/representar_puntos_geojson.js"

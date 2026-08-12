#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos de la semana 5..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/semana05/cargar_datos_semana05.js"
echo "2/2 Buscando términos mediante un índice de texto..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana05/ejemplo17/consultas/buscar_terminos_texto.js"

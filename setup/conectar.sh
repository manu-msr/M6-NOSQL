#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Abriendo la base m6_nosql en la consola de MongoDB."
echo "Escribe exit y presiona Enter para cerrar la consola."
exec "$MONGOSH_BIN" "$(mongodb_database_url)"

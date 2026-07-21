#!/usr/bin/env bash

# Funciones compartidas para la instancia didáctica de MongoDB.
# Este archivo debe cargarse desde un script que ya use `set -eu`.

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
TOOLS_DIR="$ROOT_DIR/.tools/bin"
RUNTIME_DIR="$ROOT_DIR/.runtime/mongodb"
DATA_DIR="$RUNTIME_DIR/data"
LOG_FILE="$RUNTIME_DIR/mongod.log"
MONGOD_BIN="$TOOLS_DIR/mongod"
MONGOSH_BIN="$TOOLS_DIR/mongosh"
MONGODB_HOST="127.0.0.1"
MONGODB_PORT="27017"
MONGODB_DATABASE="m6_nosql"

mongodb_admin_url() {
  printf 'mongodb://%s:%s/admin?directConnection=true' \
    "$MONGODB_HOST" "$MONGODB_PORT"
}

mongodb_database_url() {
  printf 'mongodb://%s:%s/%s?directConnection=true' \
    "$MONGODB_HOST" "$MONGODB_PORT" "$MONGODB_DATABASE"
}

mongodb_responde() {
  "$MONGOSH_BIN" "$(mongodb_admin_url)" --quiet \
    --eval 'quit(db.runCommand({ ping: 1 }).ok === 1 ? 0 : 1)' \
    >/dev/null 2>&1
}

mongodb_iniciar() {
  local intento

  if [ ! -x "$MONGOD_BIN" ] || [ ! -x "$MONGOSH_BIN" ]; then
    echo "ERROR: faltan MongoDB o su consola en $TOOLS_DIR." >&2
    echo "Ejecuta: bash setup/instalar_herramientas.sh" >&2
    return 1
  fi

  if mongodb_responde; then
    echo "    MongoDB ya está activo en $MONGODB_HOST:$MONGODB_PORT."
    return 0
  fi

  mkdir -p "$DATA_DIR"
  : > "$LOG_FILE"

  "$MONGOD_BIN" \
    --dbpath "$DATA_DIR" \
    --bind_ip "$MONGODB_HOST" \
    --port "$MONGODB_PORT" \
    --logpath "$LOG_FILE" \
    --fork \
    --setParameter diagnosticDataCollectionEnabled=false \
    >/dev/null

  intento=1
  while [ "$intento" -le 30 ]; do
    if mongodb_responde; then
      echo "    MongoDB está activo en $MONGODB_HOST:$MONGODB_PORT."
      return 0
    fi
    sleep 1
    intento=$((intento + 1))
  done

  echo "ERROR: MongoDB no respondió después de 30 segundos." >&2
  echo "Últimas líneas del registro $LOG_FILE:" >&2
  tail -n 20 "$LOG_FILE" >&2 || true
  return 1
}

mongodb_ejecutar_archivo() {
  local archivo=$1
  if [ ! -f "$archivo" ]; then
    echo "ERROR: no se encontró el archivo $archivo" >&2
    return 1
  fi
  "$MONGOSH_BIN" "$(mongodb_database_url)" --quiet "$archivo"
}

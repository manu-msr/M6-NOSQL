#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
TOOLS_DIR="$ROOT_DIR/.tools/bin"
TMP_DIR=$(mktemp -d)
MONGODB_VERSION="7.0.24"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$TOOLS_DIR"

servidor_instalado=false
if [ -x "$TOOLS_DIR/mongod" ] && \
   "$TOOLS_DIR/mongod" --version 2>/dev/null | grep -q "v$MONGODB_VERSION"; then
  servidor_instalado=true
fi

shell_instalado=false
if [ -x "$TOOLS_DIR/mongosh" ] && \
   "$TOOLS_DIR/mongosh" --version >/dev/null 2>&1; then
  shell_instalado=true
fi

if [ "$servidor_instalado" = true ] && [ "$shell_instalado" = true ]; then
  echo "MongoDB y mongosh ya están instalados dentro del clon."
  "$TOOLS_DIR/mongod" --version | sed -n '1p'
  "$TOOLS_DIR/mongosh" --version
  exit 0
fi

for herramienta in curl jq tar gzip sha256sum install; do
  if ! command -v "$herramienta" >/dev/null 2>&1; then
    echo "ERROR: la imagen de Learner Lab no incluye $herramienta." >&2
    echo "Copia este mensaje y comunícalo al docente." >&2
    exit 1
  fi
done

echo "Instalación dentro del clon ubicado en Learner Lab."

if [ "$servidor_instalado" = false ]; then
  arquitectura=$(uname -m)
  if [ "$arquitectura" != "x86_64" ]; then
    echo "ERROR: esta versión del instalador requiere arquitectura x86_64." >&2
    echo "Arquitectura detectada: $arquitectura" >&2
    exit 1
  fi

  if ! grep -qw avx /proc/cpuinfo; then
    echo "ERROR: el procesador no informa soporte para AVX." >&2
    echo "MongoDB 7.0 requiere AVX para ejecutarse en x86_64." >&2
    exit 1
  fi

  if [ ! -r /etc/os-release ]; then
    echo "ERROR: no se pudo identificar el sistema operativo." >&2
    exit 1
  fi

  # shellcheck disable=SC1091
  . /etc/os-release
  plataforma=""
  case "${ID:-}:${VERSION_ID:-}" in
    ubuntu:20.04) plataforma="ubuntu2004" ;;
    ubuntu:22.04) plataforma="ubuntu2204" ;;
    debian:11) plataforma="debian11" ;;
    debian:12) plataforma="debian12" ;;
    amzn:2) plataforma="amazon2" ;;
    amzn:2023) plataforma="amazon2023" ;;
  esac

  if [ -z "$plataforma" ]; then
    echo "ERROR: MongoDB 7.0 no está configurado para esta imagen." >&2
    echo "Sistema detectado: ${PRETTY_NAME:-desconocido}" >&2
    echo "Copia este mensaje y comunícalo al docente." >&2
    exit 1
  fi

  paquete="mongodb-linux-x86_64-${plataforma}-${MONGODB_VERSION}.tgz"
  url="https://fastdl.mongodb.org/linux/$paquete"

  echo "1/2 Descargando MongoDB Community $MONGODB_VERSION para $plataforma..."
  curl -fsSL "$url" -o "$TMP_DIR/$paquete"
  curl -fsSL "$url.sha256" -o "$TMP_DIR/$paquete.sha256"
  (
    cd "$TMP_DIR"
    sha256sum -c "$paquete.sha256"
  )
  tar -xzf "$TMP_DIR/$paquete" -C "$TMP_DIR"
  install -m 0755 \
    "$TMP_DIR/${paquete%.tgz}/bin/mongod" \
    "$TOOLS_DIR/mongod"
else
  echo "1/2 MongoDB Community $MONGODB_VERSION ya está instalado."
fi

if [ "$shell_instalado" = false ]; then
  echo "2/2 Descargando mongosh desde el instalador oficial de MongoDB..."
  curl -fsSL \
    https://raw.githubusercontent.com/mongodb-js/mongosh/refs/heads/main/download_latest.sh \
    -o "$TMP_DIR/download_mongosh.sh"
  (
    cd "$TOOLS_DIR"
    sh "$TMP_DIR/download_mongosh.sh"
  )
else
  echo "2/2 mongosh ya está instalado."
fi

echo "Herramientas instaladas dentro del clon: $TOOLS_DIR"
"$TOOLS_DIR/mongod" --version | sed -n '1p'
"$TOOLS_DIR/mongosh" --version

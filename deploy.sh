#!/bin/bash
# Deploy a producción (https://unbrokensoftwarehub.cl).
# Siempre se usa la MISMA tag: se borra y se recrea, y el pipeline reemplaza la
# imagen unbroken-web-UW1.0.0 en Docker Hub y en el servidor.
#
# Uso: ./deploy.sh "mensaje del commit"
set -e

TAG="UW1.0.0"
MSG="${1:?Falta el mensaje del commit. Uso: ./deploy.sh \"mensaje\"}"

git add -A
git commit -m "$MSG"
git push origin main

# Borrar la tag (local y remota) si existe, y recrearla sobre el commit actual
git tag -d "$TAG" 2>/dev/null || true
git push origin --delete "$TAG" 2>/dev/null || true
git tag "$TAG"
git push origin "$TAG"

echo "Deploy lanzado con la tag $TAG"

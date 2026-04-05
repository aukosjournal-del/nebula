#!/bin/bash
set -e

# ============================================================
# Nebula — Crée un worktree isolé pour développer une leçon
# Usage: ./scripts/new-worktree.sh <nom-feature>
# Ex:    ./scripts/new-worktree.sh lecon-mathematiques
# ============================================================

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "❌ Usage: ./scripts/new-worktree.sh <nom-feature>"
  echo "   Ex:   ./scripts/new-worktree.sh lecon-mathematiques"
  exit 1
fi

REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
BRANCH="feature/${NAME}"
WT_PATH="${REPO_ROOT}/worktrees/${NAME}"
DB_NAME="lumina_db_${NAME//-/_}"

# Port déterministe via hash du nom (range 3100-3199 backend, 8100-8199 frontend)
PORT_OFFSET=$(echo -n "$NAME" | cksum | awk '{print $1 % 100}')
BACKEND_PORT=$((3100 + PORT_OFFSET))
FRONTEND_PORT=$((8100 + PORT_OFFSET))

echo ""
echo "🌌 Nebula Worktree Setup"
echo "========================"
echo "  Feature  : $NAME"
echo "  Branche  : $BRANCH"
echo "  Chemin   : $WT_PATH"
echo "  Backend  : http://localhost:${BACKEND_PORT}"
echo "  Frontend : http://localhost:${FRONTEND_PORT}"
echo "  DB       : ${DB_NAME}"
echo ""

# 1. Créer le worktree
echo "📁 Création du worktree..."
git -C "$REPO_ROOT" worktree add "$WT_PATH" -b "$BRANCH" 2>&1

# 2. .env.local backend
mkdir -p "${WT_PATH}/backend"
cat > "${WT_PATH}/backend/.env.local" <<EOF
# Environnement isolé pour le worktree: ${NAME}
DATABASE_URL="postgresql://lumina:lumina_secret@localhost:5432/${DB_NAME}"
JWT_SECRET="worktree_jwt_secret_${NAME}_change_me"
JWT_REFRESH_SECRET="worktree_refresh_secret_${NAME}_change_me"
PORT=${BACKEND_PORT}
NODE_ENV=development
ALLOWED_ORIGIN="http://localhost:${FRONTEND_PORT}"
EOF
echo "  ✓ backend/.env.local créé (port ${BACKEND_PORT})"

# 3. .env.local frontend
mkdir -p "${WT_PATH}/frontend"
cat > "${WT_PATH}/frontend/.env.local" <<EOF
# Environnement isolé pour le worktree: ${NAME}
VITE_PORT=${FRONTEND_PORT}
VITE_API_URL=http://localhost:${BACKEND_PORT}
EOF
echo "  ✓ frontend/.env.local créé (port ${FRONTEND_PORT})"

# 4. Créer la DB PostgreSQL isolée
if command -v createdb &> /dev/null; then
  createdb -U lumina "$DB_NAME" 2>/dev/null && echo "  ✓ DB créée: ${DB_NAME}" || echo "  ℹ DB existe déjà: ${DB_NAME}"
else
  echo "  ⚠ createdb non trouvé — crée manuellement: createdb -U lumina ${DB_NAME}"
fi

echo ""
echo "✅ Worktree prêt !"
echo ""
echo "Pour démarrer:"
echo "  Terminal 1 (backend)  → cd ${WT_PATH}/backend && cp .env.local .env && bun run build && node run.mjs"
echo "  Terminal 2 (frontend) → cd ${WT_PATH}/frontend && VITE_PORT=${FRONTEND_PORT} bun run dev"
echo ""
echo "Pour ajouter une leçon:"
echo "  1. Crée content/courses/<slug>/course.json"
echo "  2. Crée content/courses/<slug>/<NN-slug>.mdx"
echo "  3. Lance: bun run sync-content"
echo ""
echo "Pour merger cette leçon:"
echo "  git add content/courses/<slug>/"
echo "  git commit -m 'feat(content): add <slug> course'"
echo "  git checkout main && git merge --squash $BRANCH"
echo "  git commit -m 'feat: add <nom> course'"
echo ""

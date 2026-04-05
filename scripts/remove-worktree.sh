#!/bin/bash
set -e

# ============================================================
# Nebula — Supprime un worktree et sa DB isolée
# Usage: ./scripts/remove-worktree.sh <nom-feature>
# ============================================================

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "❌ Usage: ./scripts/remove-worktree.sh <nom-feature>"
  exit 1
fi

REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
WT_PATH="${REPO_ROOT}/worktrees/${NAME}"
DB_NAME="lumina_db_${NAME//-/_}"

echo ""
echo "🗑  Suppression du worktree: $NAME"
echo ""

# Supprimer la DB
if command -v dropdb &> /dev/null; then
  dropdb -U lumina "$DB_NAME" 2>/dev/null && echo "  ✓ DB supprimée: $DB_NAME" || echo "  ℹ DB introuvable: $DB_NAME"
fi

# Supprimer le worktree
if [ -d "$WT_PATH" ]; then
  git -C "$REPO_ROOT" worktree remove "$WT_PATH" --force 2>&1 && echo "  ✓ Worktree supprimé: $WT_PATH"
else
  echo "  ℹ Worktree introuvable: $WT_PATH"
fi

# Nettoyer les métadonnées git
git -C "$REPO_ROOT" worktree prune
echo "  ✓ Métadonnées git nettoyées"

echo ""
echo "✅ Nettoyage terminé !"
echo ""

# Guide Git Worktrees — Nebula

## Concept

Les worktrees Git permettent de développer plusieurs leçons en parallèle sans `git stash`. Chaque worktree est un répertoire physiquement distinct avec sa propre branche, sa propre DB et ses propres ports.

## Créer un worktree pour une nouvelle leçon

```bash
./scripts/new-worktree.sh lecon-mathematiques
```

Cela crée automatiquement :
- `worktrees/lecon-mathematiques/` — copie de travail isolée
- `backend/.env.local` — DB + ports dédiés
- `frontend/.env.local` — port frontend dédié
- DB PostgreSQL `lumina_db_lecon_mathematiques`

## Convention des ports

| Worktree | Backend | Frontend |
|----------|---------|----------|
| main | 3000 | 8080 |
| lecon-algebre | 3100-3199 | 8100-8199 |
| lecon-histoire | 3100-3199 | 8100-8199 |

Les ports sont déterministes (hash du nom), toujours les mêmes pour le même worktree.

## Ajouter une leçon

1. Dans le worktree créé, ajoute les fichiers :
   ```
   content/courses/<slug>/
   ├── course.json    # métadonnées du cours
   └── NN-slug.mdx   # leçon (frontmatter + contenu MDX)
   ```

2. Format `course.json` :
   ```json
   {
     "slug": "mathematiques",
     "title": "Mathématiques",
     "description": "...",
     "iconName": "Calculator",
     "color": "#4ade80",
     "order": 3
   }
   ```

3. Format `.mdx` :
   ```mdx
   ---
   title: "Titre de la leçon"
   order: 0
   estimatedMinutes: 5
   questions:
     - prompt: "Question ?"
       order: 0
       answers:
         - text: "Bonne réponse"
           isCorrect: true
         - text: "Mauvaise réponse 1"
           isCorrect: false
         - text: "Mauvaise réponse 2"
           isCorrect: false
   ---

   ## Contenu de la leçon en Markdown...
   ```

4. Sync en DB :
   ```bash
   bun run sync-content
   ```

5. Valider :
   ```bash
   bun run validate-content
   ```

## Merger une leçon dans main

```bash
# Dans le worktree
git add content/courses/<slug>/
git commit -m "feat(content): add <slug>"

# Retour sur main
git checkout main
git merge --squash feature/<nom>
git commit -m "feat: add <nom> course"

# Nettoyage
./scripts/remove-worktree.sh <nom>
```

## Développer en parallèle avec des agents IA

Chaque Claude Code session tourne dans son propre worktree → aucun conflit de fichiers.

```
Agent 1 (worktree A) → Développe leçon Algèbre
Agent 2 (worktree B) → Développe leçon Histoire
Agent 3 (main)       → Stabilise le moteur de l'app
```

## Nettoyage

```bash
# Supprimer un worktree et sa DB
./scripts/remove-worktree.sh <nom>

# Lister les worktrees actifs
git worktree list

# Nettoyer les métadonnées obsolètes
git worktree prune
```

# Nebula — Contexte pour Agents IA

## Projet

Plateforme d'apprentissage mobile-first (PWA → iOS/Android) avec moteur SM-2 (spaced repetition), design dark cosmic et mascotte Lumi (comète).

## Stack

| Couche | Tech | Port |
|--------|------|------|
| Backend | Fastify + TypeScript + Prisma + PostgreSQL | 3000 |
| Frontend | React + Vite + Tailwind + Framer Motion | 8080 |
| Runtime | Bun 1.3.11 | — |
| DB | PostgreSQL via Homebrew, user: lumina | 5432 |

## Contraintes critiques

- **tsx + Prisma = INCOMPATIBLE** : utilise `tsc` + `node run.mjs` pour la prod. Pour les scripts seed/sync : `bun run script.ts`
- **NE JAMAIS** utiliser `tsx` pour exécuter des scripts qui importent `@prisma/client`
- **Dark theme only** : jamais de light theme, jamais de `bg-white`, jamais de `text-black`
- **Lumi** : comète avec yeux uniquement, JAMAIS de bouche, pas de sourire dessiné
- **App name** : Nebula (pas Lumina, pas "Lumina App")

## Architecture Backend

```
backend/src/
  modules/auth/      → JWT login/register/refresh/logout
  modules/courses/   → listing cours + progress
  modules/progress/  → advance/reset progress (legacy)
  modules/cards/     → SM-2 engine (session, review, stats)
  modules/achievements/ → badges + triggers
  modules/streak/    → streak tracking
  lib/sm2.ts         → algorithme SM-2 pur
  plugins/           → Fastify plugins (cors, jwt, prisma)
```

## Architecture Frontend

```
frontend/src/
  components/LuminaApp.tsx   → app principale (HubView, FocusView, CelebrationView)
  components/LessonContent.tsx → rendu MDX via react-markdown
  components/QualityRating.tsx → notation SM-2 (5 emojis)
  components/LearningDashboard.tsx → stats SM-2
  components/AchievementToast.tsx  → notification badge
  components/InstallPrompt.tsx     → PWA install
  lib/sm2.ts                 → calculs SM-2 client-side
  lib/api.ts                 → HTTP client (Bearer JWT)
  contexts/AuthContext.tsx   → auth state
```

## Content-as-Code

Les leçons vivent dans `content/courses/[slug]/` :
- `course.json` — métadonnées (slug, title, icon, color, order)
- `NN-slug.mdx` — frontmatter YAML (title, order, questions[]) + corps Markdown

Pour ajouter une leçon :
1. Créer les fichiers dans `content/courses/[slug]/`
2. `bun run validate-content` — valide Zod
3. `bun run sync-content` — upsert en DB

## Design System

```css
--background: 230 25% 5%   /* quasi-noir bleu */
--foreground: 210 40% 92%  /* blanc bleuté */
--primary: 190 100% 50%    /* cyan éclatant */
--glow-cyan: 190 100% 50%
--glow-purple: 270 80% 60%
```

- Fonts : Orbitron (display), Space Grotesk (body)
- Cards : `rounded-3xl bg-muted/15 border-border`
- Animations : Framer Motion, `damping: 20, stiffness: 120`
- Glow : `text-glow-cyan`, `box-glow-cyan` (classes CSS custom)

## Algorithme SM-2

```typescript
// quality: 0=oublié, 2=difficile, 3=correct, 4=bien, 5=parfait
// Si quality >= 3 : interval *= easeFactor, repetitions++
// Si quality < 3  : interval = 1, repetitions = 0
// easeFactor = max(1.3, EF + 0.1 - (5-q)*(0.08+(5-q)*0.02))
```

## Worktrees

Voir `WORKTREE.md` pour le guide complet.
Scripts : `./scripts/new-worktree.sh <nom>` / `./scripts/remove-worktree.sh <nom>`

## Commandes utiles

```bash
# Backend
cd backend && bun run dev           # dev (tsx watch)
cd backend && bun run build         # compile TypeScript
cd backend && node run.mjs          # prod

# Frontend
cd frontend && bun run dev          # dev server port 8080
cd frontend && bun run build        # production build

# Contenu
bun run sync-content                # MDX files → DB
bun run validate-content            # valide tous les fichiers MDX

# DB
cd backend && bun run db:migrate    # migrations Prisma
cd backend && bun run db:studio     # Prisma Studio (GUI)
```

## Compte test

Email: test@nebula.io
Password: nebula2026
Username: testuser

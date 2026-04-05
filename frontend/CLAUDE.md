# Frontend Nebula — Contexte Agent

## Stack
React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + React Query + React Router

## Composants principaux

```
LuminaApp.tsx     → orchestre 4 vues: hub | focus | study | celebrate
  HubView         → dashboard, liste cours, LearningDashboard
  FocusView       → leçon + quiz (legacy progress)
  StudySession    → queue SM-2 avec QualityRating
  CelebrationView → fin de session, confetti, Lumi happy

LumiMascot        → comète animée (yeux seulement, PAS de bouche)
BioluminescenceEngine → canvas background (100 particules)
LessonContent     → rendu MDX avec react-markdown
QualityRating     → 5 boutons emoji (0,2,3,4,5)
LearningDashboard → stats SM-2 (dûes, maîtrisées, %)
AchievementToast  → notification badge débloqué
InstallPrompt     → banner PWA install (Android Chrome)
```

## CSS Variables importantes

```css
--background: 230 25% 5%    /* fond quasi-noir */
--primary: 190 100% 50%     /* cyan */
--glow-cyan / --glow-purple  /* couleurs de lueur */
```

Classes utiles : `text-glow-cyan`, `box-glow-cyan`, `font-display` (Orbitron), `font-body` (Space Grotesk)

## Patterns Framer Motion

```typescript
// Spring standard
transition={{ type: 'spring', damping: 20, stiffness: 120 }}

// Micro-bounce
transition={{ type: 'spring', damping: 12, stiffness: 250 }}

// Fluid ease
transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
```

## API Client

```typescript
import { api } from '../lib/api'

// GET
const data = await api.get<ResponseType>('/cards/stats')

// POST
const result = await api.post<ResponseType>('/cards/questionId/review', { quality: 4 })
```

## React Query patterns

```typescript
const { data } = useQuery({
  queryKey: ['card-stats'],
  queryFn: () => api.get<CardStats>('/cards/stats'),
  staleTime: 60_000,
})

const mutation = useMutation({
  mutationFn: (vars) => api.post('/endpoint', vars),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['key'] }),
})
```

## Règles design

- JAMAIS de light theme, fond toujours dark
- Lumi = comète, yeux seulement, JAMAIS de bouche
- Toujours `rounded-3xl` pour les cards principales
- Glows cyan sur les éléments actifs, purple sur les accents
- Animations obligatoires sur tous les éléments interactifs (hover scale, tap scale)

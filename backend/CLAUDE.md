# Backend Nebula — Contexte Agent

## Stack
Fastify 4 + TypeScript + Prisma ORM + PostgreSQL + JWT

## Pattern de module

```typescript
// routes.ts — enregistre les routes
export async function xRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, handler)
}

// controller.ts — parse request, appelle service
export async function handler(req: FastifyRequest, reply: FastifyReply) {
  const result = await serviceFunction(req.server, req.user.id)
  return reply.send(result)
}

// service.ts — logique métier + Prisma
export async function serviceFunction(fastify: FastifyInstance, userId: string) {
  return fastify.prisma.model.findMany({ where: { userId } })
}
```

## Contraintes Prisma

- **JAMAIS `tsx` pour les scripts** → utiliser `bun run script.ts` directement
- Build : `tsc` → `node dist/index.js` (ou `node run.mjs`)
- `prisma generate` nécessaire après chaque changement de schema
- Migrations : `bun run db:migrate` (= `prisma migrate dev`)

## Endpoints disponibles

```
POST /api/v1/auth/register|login|refresh|logout
GET  /api/v1/auth/me
GET  /api/v1/courses
GET  /api/v1/courses/:courseId
GET  /api/v1/progress
POST /api/v1/progress/:courseId/advance
POST /api/v1/progress/:courseId/reset
GET  /api/v1/cards/session?courseId=
POST /api/v1/cards/:questionId/review  { quality: 0-5 }
GET  /api/v1/cards/stats
GET  /api/v1/achievements
GET  /api/v1/achievements/me
GET  /api/v1/streak
```

## Schéma DB (résumé)

User → Progress (par cours), Streak, CardReview (par question), UserAchievement
Course → Lesson → Question → Answer
Achievement (global, seedé)

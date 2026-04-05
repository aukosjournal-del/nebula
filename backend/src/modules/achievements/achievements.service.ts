import { FastifyInstance } from 'fastify'

export async function getAllAchievements(fastify: FastifyInstance) {
  return fastify.prisma.achievement.findMany({ orderBy: { rarity: 'asc' } })
}

export async function getUserAchievements(fastify: FastifyInstance, userId: string) {
  return fastify.prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' },
  })
}

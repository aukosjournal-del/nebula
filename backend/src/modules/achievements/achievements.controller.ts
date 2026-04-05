import { FastifyRequest, FastifyReply } from 'fastify'
import { getAllAchievements, getUserAchievements } from './achievements.service'

export async function listAchievements(request: FastifyRequest, reply: FastifyReply) {
  const achievements = await getAllAchievements(request.server)
  return reply.send({ achievements })
}

export async function myAchievements(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.userId
  const achievements = await getUserAchievements(request.server, userId)
  return reply.send({ achievements })
}

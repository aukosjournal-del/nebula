import { FastifyRequest, FastifyReply } from 'fastify'
import { getStreak } from './streak.service'

export async function getUserStreak(request: FastifyRequest, reply: FastifyReply) {
  const streak = await getStreak(request.server.prisma, request.user.userId)
  return reply.send(streak)
}

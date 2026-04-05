import { FastifyRequest, FastifyReply } from 'fastify'
import { getStudySession, submitReview, getCardStats } from './cards.service'
import { reviewSchema } from './cards.schema'

export async function getSession(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.userId
  const { courseId } = request.query as { courseId?: string }
  const session = await getStudySession(request.server, userId, courseId)
  return reply.send({ session })
}

export async function reviewCard(request: FastifyRequest, reply: FastifyReply) {
  const { quality } = reviewSchema.parse(request.body)
  const { questionId } = request.params as { questionId: string }
  const userId = request.user.userId
  const result = await submitReview(request.server, userId, questionId, quality)
  return reply.send(result)
}

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.userId
  const stats = await getCardStats(request.server, userId)
  return reply.send(stats)
}

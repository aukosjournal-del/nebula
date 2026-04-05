import { FastifyRequest, FastifyReply } from 'fastify'
import { advanceSchema } from './progress.schema'
import {
  getProgress,
  getCourseProgress,
  advanceProgress,
  resetProgress,
} from './progress.service'

export async function listProgress(request: FastifyRequest, reply: FastifyReply) {
  const progress = await getProgress(request.server.prisma, request.user.userId)
  return reply.send(progress)
}

export async function getCourseProg(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const courseId = (request.params as any).courseId
  const progress = await getCourseProgress(
    request.server.prisma,
    request.user.userId,
    courseId
  )
  if (!progress) return reply.status(404).send({ error: 'Progression non trouvée' })
  return reply.send(progress)
}

export async function advance(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const courseId = (request.params as any).courseId
  const parsed = advanceSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation', errors: parsed.error.flatten().fieldErrors })
  }

  try {
    const result = await advanceProgress(
      request.server.prisma,
      request.user.userId,
      courseId,
      parsed.data.answerId
    )
    return reply.send(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'COURSE_NOT_FOUND') return reply.status(404).send({ error: 'Cours non trouvé' })
    if (msg === 'LESSON_NOT_FOUND') return reply.status(404).send({ error: 'Leçon non trouvée' })
    throw err
  }
}

export async function reset(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const courseId = (request.params as any).courseId
  try {
    const progress = await resetProgress(
      request.server.prisma,
      request.user.userId,
      courseId
    )
    return reply.send(progress)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'COURSE_NOT_FOUND') return reply.status(404).send({ error: 'Cours non trouvé' })
    throw err
  }
}

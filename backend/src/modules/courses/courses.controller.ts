import { FastifyRequest, FastifyReply } from 'fastify'
import { getCourses, getCourseById } from './courses.service'

export async function listCourses(request: FastifyRequest, reply: FastifyReply) {
  const courses = await getCourses(request.server.prisma, request.user.userId)
  return reply.send(courses)
}

export async function getCourse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const courseId = (request.params as any).courseId
  const course = await getCourseById(
    request.server.prisma,
    courseId,
    request.user.userId
  )
  if (!course) return reply.status(404).send({ error: 'Cours non trouvé' })
  return reply.send(course)
}

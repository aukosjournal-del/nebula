import { FastifyInstance } from 'fastify'
import { listCourses, getCourse } from './courses.controller'

export default async function courseRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, listCourses)
  fastify.get('/:courseId', { preHandler: [fastify.authenticate] }, getCourse)
}

import { FastifyInstance } from 'fastify'
import { listProgress, getCourseProg, advance, reset } from './progress.controller'

export default async function progressRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, listProgress)
  fastify.get('/:courseId', { preHandler: [fastify.authenticate] }, getCourseProg)
  fastify.post('/:courseId/advance', { preHandler: [fastify.authenticate] }, advance)
  fastify.post('/:courseId/reset', { preHandler: [fastify.authenticate] }, reset)
}

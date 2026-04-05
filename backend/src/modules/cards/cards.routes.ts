import { FastifyInstance } from 'fastify'
import { getSession, reviewCard, getStats } from './cards.controller'

export async function cardsRoutes(fastify: FastifyInstance) {
  fastify.get('/session', { preHandler: [fastify.authenticate] }, getSession)
  fastify.post('/:questionId/review', { preHandler: [fastify.authenticate] }, reviewCard)
  fastify.get('/stats', { preHandler: [fastify.authenticate] }, getStats)
}

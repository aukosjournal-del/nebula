import { FastifyInstance } from 'fastify'
import { getUserStreak } from './streak.controller'

export default async function streakRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, getUserStreak)
}

import { FastifyInstance } from 'fastify'
import { listAchievements, myAchievements } from './achievements.controller'

export async function achievementsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, listAchievements)
  fastify.get('/me', { preHandler: [fastify.authenticate] }, myAchievements)
}

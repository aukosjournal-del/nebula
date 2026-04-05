import { FastifyInstance } from 'fastify'
import { register, login, refresh, logout, me } from './auth.controller'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', register)
  fastify.post('/login', login)
  fastify.post('/refresh', refresh)
  fastify.post('/logout', logout)
  fastify.get('/me', { preHandler: [fastify.authenticate] }, me)
}

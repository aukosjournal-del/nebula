import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { env } from '../config/env'

const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(fastifyCookie)

  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch {
        reply.status(401).send({ error: 'Non autorisé', message: 'Token invalide ou expiré' })
      }
    }
  )
})

export default jwtPlugin

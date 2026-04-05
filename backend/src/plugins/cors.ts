import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { FastifyPluginAsync } from 'fastify'
import { env } from '../config/env'

const corsPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(cors, {
    origin: env.ALLOWED_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
})

export default corsPlugin

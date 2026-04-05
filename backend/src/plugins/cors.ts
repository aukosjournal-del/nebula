import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { FastifyPluginAsync } from 'fastify'
import { env } from '../config/env'

const corsPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Support comma-separated list of origins e.g. "https://app.com,https://www.app.com"
  const origins = env.ALLOWED_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
  const origin = origins.length === 1 ? origins[0] : origins

  fastify.register(cors, {
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
})

export default corsPlugin

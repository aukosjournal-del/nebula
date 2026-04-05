import '../src/types'
import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma'
import corsPlugin from './plugins/cors'
import jwtPlugin from './plugins/jwt'
import authRoutes from './modules/auth/auth.routes'
import courseRoutes from './modules/courses/courses.routes'
import progressRoutes from './modules/progress/progress.routes'
import streakRoutes from './modules/streak/streak.routes'

export function createApp() {
  const fastify = Fastify({
    logger:
      process.env.NODE_ENV !== 'production'
        ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
        : true,
  })

  // Plugins
  fastify.register(prismaPlugin)
  fastify.register(corsPlugin)
  fastify.register(jwtPlugin)

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  // API routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth' })
  fastify.register(courseRoutes, { prefix: '/api/v1/courses' })
  fastify.register(progressRoutes, { prefix: '/api/v1/progress' })
  fastify.register(streakRoutes, { prefix: '/api/v1/streak' })

  return fastify
}

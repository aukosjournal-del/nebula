import { FastifyRequest, FastifyReply } from 'fastify'
import { registerSchema, loginSchema } from './auth.schema'
import { registerUser, loginUser, getUserById } from './auth.service'
import { env } from '../../config/env'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation', errors: parsed.error.flatten().fieldErrors })
  }

  try {
    const user = await registerUser(request.server.prisma, parsed.data)
    const token = request.server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '7d' }
    )
    const refreshToken = request.server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '30d' }
    )

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 30 * 24 * 60 * 60,
    })

    return reply.status(201).send({ token, user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'EMAIL_EXISTS') return reply.status(409).send({ error: 'Cet email est déjà utilisé' })
    if (msg === 'USERNAME_EXISTS') return reply.status(409).send({ error: "Ce nom d'utilisateur est déjà pris" })
    throw err
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation', errors: parsed.error.flatten().fieldErrors })
  }

  try {
    const user = await loginUser(request.server.prisma, parsed.data)
    const token = request.server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '7d' }
    )
    const refreshToken = request.server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '30d' }
    )

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 30 * 24 * 60 * 60,
    })

    return reply.send({ token, user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'INVALID_CREDENTIALS')
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    throw err
  }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken
  if (!refreshToken) return reply.status(401).send({ error: 'Pas de refresh token' })

  try {
    const payload = request.server.jwt.verify<{ userId: string; email: string }>(refreshToken)
    const token = request.server.jwt.sign(
      { userId: payload.userId, email: payload.email },
      { expiresIn: '7d' }
    )
    return reply.send({ token })
  } catch {
    return reply.status(401).send({ error: 'Refresh token invalide ou expiré' })
  }
}

export async function logout(_request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' })
  return reply.send({ message: 'Déconnecté avec succès' })
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserById(request.server.prisma, request.user.userId)
  if (!user) return reply.status(404).send({ error: 'Utilisateur non trouvé' })

  const streak = await request.server.prisma.streak.findUnique({
    where: { userId: user.id },
  })

  return reply.send({ ...user, streak: streak?.currentStreak ?? 0 })
}

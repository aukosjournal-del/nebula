import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { RegisterInput, LoginInput } from './auth.schema'

export async function registerUser(prisma: PrismaClient, input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new Error('EMAIL_EXISTS')

  const existingUsername = await prisma.user.findUnique({ where: { username: input.username } })
  if (existingUsername) throw new Error('USERNAME_EXISTS')

  const passwordHash = await bcrypt.hash(input.password, 12)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash,
      streak: { create: { currentStreak: 0, longestStreak: 0 } },
    },
    select: { id: true, email: true, username: true, createdAt: true },
  })

  return user
}

export async function loginUser(prisma: PrismaClient, input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')

  return { id: user.id, email: user.email, username: user.username }
}

export async function getUserById(prisma: PrismaClient, userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, createdAt: true },
  })
}

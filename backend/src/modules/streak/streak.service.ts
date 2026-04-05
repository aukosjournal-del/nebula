import { PrismaClient } from '@prisma/client'

function isToday(date: Date): boolean {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

export async function updateStreak(
  prisma: PrismaClient,
  userId: string
): Promise<{ currentStreak: number; streakUpdated: boolean }> {
  let streak = await prisma.streak.findUnique({ where: { userId } })

  if (!streak) {
    streak = await prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1 },
    })
    return { currentStreak: 1, streakUpdated: true }
  }

  if (isToday(streak.lastActivityAt)) {
    return { currentStreak: streak.currentStreak, streakUpdated: false }
  }

  const newStreak = isYesterday(streak.lastActivityAt) ? streak.currentStreak + 1 : 1

  const updated = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityAt: new Date(),
    },
  })

  return { currentStreak: updated.currentStreak, streakUpdated: true }
}

export async function getStreak(prisma: PrismaClient, userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } })
  return streak ?? { currentStreak: 0, longestStreak: 0, lastActivityAt: null }
}

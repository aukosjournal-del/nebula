import { FastifyInstance } from 'fastify'
import { calculateSM2 } from '../../lib/sm2'

const SESSION_SIZE = 10

export async function getStudySession(fastify: FastifyInstance, userId: string, courseId?: string) {
  const prisma = fastify.prisma

  // Get all questions for the course (or all courses)
  const whereClause = courseId
    ? { lesson: { courseId } }
    : {}

  const allQuestions = await prisma.question.findMany({
    where: whereClause,
    include: { lesson: { include: { course: true } } },
  })

  if (allQuestions.length === 0) return []

  // Get existing card reviews for this user
  const existingReviews = await prisma.cardReview.findMany({
    where: { userId, questionId: { in: allQuestions.map(q => q.id) } },
  })

  const reviewMap = new Map(existingReviews.map(r => [r.questionId, r]))
  const now = new Date()

  // Categorize cards
  const newCards = allQuestions.filter(q => !reviewMap.has(q.id))
  const dueCards = allQuestions.filter(q => {
    const r = reviewMap.get(q.id)
    return r && r.dueDate <= now && r.interval <= 3
  })
  const strugglingCards = allQuestions.filter(q => {
    const r = reviewMap.get(q.id)
    return r && r.easeFactor < 2.0 && r.dueDate <= now
  })

  // Build session queue: 20% due, 60% new, 20% struggling
  const sessionCards = [
    ...dueCards.slice(0, Math.ceil(SESSION_SIZE * 0.2)),
    ...newCards.slice(0, Math.ceil(SESSION_SIZE * 0.6)),
    ...strugglingCards.slice(0, Math.ceil(SESSION_SIZE * 0.2)),
  ].slice(0, SESSION_SIZE)

  // If not enough, fill with any due cards
  if (sessionCards.length < SESSION_SIZE) {
    const allDue = allQuestions.filter(q => {
      const r = reviewMap.get(q.id)
      return (!r) || (r.dueDate <= now)
    })
    const extra = allDue.filter(q => !sessionCards.find(c => c.id === q.id))
    sessionCards.push(...extra.slice(0, SESSION_SIZE - sessionCards.length))
  }

  return sessionCards.map(q => {
    const review = reviewMap.get(q.id)
    return {
      questionId: q.id,
      prompt: q.prompt,
      lessonTitle: q.lesson.title,
      courseTitle: q.lesson.course.title,
      courseColor: q.lesson.course.color,
      easeFactor: review?.easeFactor ?? 2.5,
      interval: review?.interval ?? 0,
      repetitions: review?.repetitions ?? 0,
      isNew: !review,
    }
  })
}

export async function submitReview(
  fastify: FastifyInstance,
  userId: string,
  questionId: string,
  quality: number
) {
  const prisma = fastify.prisma

  // Get or create card review
  const existing = await prisma.cardReview.findUnique({
    where: { userId_questionId: { userId, questionId } },
  })

  const currentState = {
    easeFactor: existing?.easeFactor ?? 2.5,
    interval: existing?.interval ?? 0,
    repetitions: existing?.repetitions ?? 0,
  }

  const result = calculateSM2(currentState, quality)

  await prisma.cardReview.upsert({
    where: { userId_questionId: { userId, questionId } },
    update: {
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      dueDate: result.dueDate,
      lastReview: new Date(),
      quality,
    },
    create: {
      userId,
      questionId,
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      dueDate: result.dueDate,
      lastReview: new Date(),
      quality,
    },
  })

  // Check and award achievements
  const newAchievements = await checkAndAwardAchievements(fastify, userId)

  return {
    questionId,
    quality,
    nextReview: result.dueDate,
    interval: result.interval,
    easeFactor: result.easeFactor,
    newAchievements,
  }
}

export async function getCardStats(fastify: FastifyInstance, userId: string) {
  const prisma = fastify.prisma
  const now = new Date()

  const [totalCards, dueToday, reviews] = await Promise.all([
    prisma.question.count(),
    prisma.cardReview.count({ where: { userId, dueDate: { lte: now } } }),
    prisma.cardReview.findMany({ where: { userId } }),
  ])

  const avgEaseFactor = reviews.length
    ? reviews.reduce((sum, r) => sum + r.easeFactor, 0) / reviews.length
    : 2.5

  const masteredCards = reviews.filter(r => r.interval > 30).length

  return { totalCards, dueToday, masteredCards, avgEaseFactor, totalReviewed: reviews.length }
}

async function checkAndAwardAchievements(fastify: FastifyInstance, userId: string) {
  const prisma = fastify.prisma

  const achievements = await prisma.achievement.findMany()
  const userAchievements = await prisma.userAchievement.findMany({ where: { userId } })
  const earnedSlugs = new Set(userAchievements.map(ua => {
    return achievements.find(a => a.id === ua.achievementId)?.slug
  }).filter(Boolean))

  const newlyEarned: typeof achievements = []

  for (const achievement of achievements) {
    if (earnedSlugs.has(achievement.slug)) continue

    const condition = achievement.condition as Record<string, unknown>
    let earned = false

    if (condition.type === 'first-review') {
      const count = await prisma.cardReview.count({ where: { userId } })
      earned = count >= 1
    } else if (condition.type === 'streak') {
      const streak = await prisma.streak.findUnique({ where: { userId } })
      earned = (streak?.currentStreak ?? 0) >= (condition.threshold as number)
    } else if (condition.type === 'master-cards') {
      const mastered = await prisma.cardReview.count({
        where: { userId, interval: { gt: 30 } },
      })
      earned = mastered >= (condition.threshold as number)
    }

    if (earned) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      })
      newlyEarned.push(achievement)
    }
  }

  return newlyEarned
}

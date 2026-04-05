import { PrismaClient } from '@prisma/client'
import { updateStreak } from '../streak/streak.service'

const STEPS_PER_LESSON = 3

export async function getProgress(prisma: PrismaClient, userId: string) {
  return prisma.progress.findMany({ where: { userId } })
}

export async function getCourseProgress(
  prisma: PrismaClient,
  userId: string,
  courseId: string
) {
  return prisma.progress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
}

export async function advanceProgress(
  prisma: PrismaClient,
  userId: string,
  courseId: string,
  answerId?: string
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })
  if (!course) throw new Error('COURSE_NOT_FOUND')

  const totalLessons = course.lessons.length

  let progress = await prisma.progress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })

  if (!progress) {
    progress = await prisma.progress.create({
      data: {
        userId,
        courseId,
        currentLessonId: course.lessons[0]?.id,
        completedSteps: 0,
        percentage: 0,
      },
    })
  }

  if (progress.completedAt) {
    return { alreadyComplete: true, percentage: 100, streakUpdated: false, streak: 0 }
  }

  // Validate answer if provided
  let correct = true
  if (answerId) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } })
    correct = answer?.isCorrect ?? false
  }

  const currentLessonIndex = course.lessons.findIndex(
    (l) => l.id === progress!.currentLessonId
  )
  if (currentLessonIndex === -1) throw new Error('LESSON_NOT_FOUND')

  const newSteps = progress.completedSteps + 1
  const lessonComplete = newSteps >= STEPS_PER_LESSON
  const isLastLesson = currentLessonIndex === totalLessons - 1
  const courseComplete = lessonComplete && isLastLesson

  // Calculate percentage
  const completedLessonsCount = lessonComplete ? currentLessonIndex + 1 : currentLessonIndex
  const stepsInCurrentLesson = lessonComplete ? 0 : newSteps
  const totalStepsDone = completedLessonsCount * STEPS_PER_LESSON + stepsInCurrentLesson
  const newPercentage = Math.min(
    (totalStepsDone / (totalLessons * STEPS_PER_LESSON)) * 100,
    100
  )

  const nextLessonId =
    lessonComplete && !isLastLesson
      ? course.lessons[currentLessonIndex + 1].id
      : progress.currentLessonId

  const updatedProgress = await prisma.progress.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      completedSteps: lessonComplete ? 0 : newSteps,
      currentLessonId: lessonComplete && !isLastLesson ? nextLessonId : progress.currentLessonId,
      percentage: newPercentage,
      completedAt: courseComplete ? new Date() : null,
    },
  })

  let streakResult = { currentStreak: 0, streakUpdated: false }
  if (lessonComplete) {
    streakResult = await updateStreak(prisma, userId)
  }

  return {
    correct,
    percentage: updatedProgress.percentage,
    completedSteps: updatedProgress.completedSteps,
    lessonComplete,
    courseComplete,
    streakUpdated: streakResult.streakUpdated,
    streak: streakResult.currentStreak,
    nextLessonId: lessonComplete && !isLastLesson ? nextLessonId : null,
  }
}

export async function resetProgress(prisma: PrismaClient, userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' }, take: 1 } },
  })
  if (!course) throw new Error('COURSE_NOT_FOUND')

  return prisma.progress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      currentLessonId: course.lessons[0]?.id,
      completedSteps: 0,
      percentage: 0,
    },
    update: {
      currentLessonId: course.lessons[0]?.id,
      completedSteps: 0,
      percentage: 0,
      completedAt: null,
    },
  })
}

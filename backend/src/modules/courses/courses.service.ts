import { PrismaClient } from '@prisma/client'

export async function getCourses(prisma: PrismaClient, userId: string) {
  const [courses, progresses] = await Promise.all([
    prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true },
        },
      },
    }),
    prisma.progress.findMany({ where: { userId } }),
  ])

  return courses.map((course) => {
    const progress = progresses.find((p) => p.courseId === course.id)
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      iconName: course.iconName,
      color: course.color,
      order: course.order,
      lessonCount: course.lessons.length,
      lessons: course.lessons,
      progress: progress
        ? {
            percentage: progress.percentage,
            completedSteps: progress.completedSteps,
            currentLessonId: progress.currentLessonId,
            completedAt: progress.completedAt,
          }
        : {
            percentage: 0,
            completedSteps: 0,
            currentLessonId: course.lessons[0]?.id ?? null,
            completedAt: null,
          },
    }
  })
}

export async function getCourseById(prisma: PrismaClient, courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              answers: { select: { id: true, text: true } },
            },
          },
        },
      },
    },
  })

  if (!course) return null

  const progress = await prisma.progress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })

  return {
    ...course,
    progress: progress
      ? {
          percentage: progress.percentage,
          completedSteps: progress.completedSteps,
          currentLessonId: progress.currentLessonId,
          completedAt: progress.completedAt,
        }
      : {
          percentage: 0,
          completedSteps: 0,
          currentLessonId: course.lessons[0]?.id ?? null,
          completedAt: null,
        },
  }
}

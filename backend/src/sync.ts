import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const prisma = new PrismaClient()

// Inline schemas (avoid cross-package imports in compiled output)
const AnswerSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
})

const QuestionSchema = z.object({
  prompt: z.string().min(1),
  order: z.number().int().min(0),
  answers: z.array(AnswerSchema).length(3),
})

const LessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().min(1).default(5),
  questions: z.array(QuestionSchema).min(1).max(5),
})

const CourseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  order: z.number().int().min(0),
})

// __dirname = backend/dist/ → content/courses is ../../content/courses
const CONTENT_DIR = resolve(__dirname, '../../content/courses')

async function syncContent() {
  console.log('🔄 Syncing content to database...\n')

  const courseDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const courseSlug of courseDirs) {
    const courseDir = join(CONTENT_DIR, courseSlug)

    const courseRaw = JSON.parse(readFileSync(join(courseDir, 'course.json'), 'utf-8'))
    const courseData = CourseSchema.parse(courseRaw)

    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: { title: courseData.title, iconName: courseData.iconName, color: courseData.color, order: courseData.order },
      create: { slug: courseData.slug, title: courseData.title, iconName: courseData.iconName, color: courseData.color, order: courseData.order },
    })

    console.log(`  📚 ${courseData.title} (${course.id})`)

    const mdxFiles = readdirSync(courseDir)
      .filter(f => f.endsWith('.mdx'))
      .sort()

    for (const mdxFile of mdxFiles) {
      const raw = readFileSync(join(courseDir, mdxFile), 'utf-8')
      const { data: frontmatter, content: mdxContent } = matter(raw)
      const lessonData = LessonFrontmatterSchema.parse(frontmatter)

      const lesson = await prisma.lesson.upsert({
        where: { courseId_order: { courseId: course.id, order: lessonData.order } },
        update: { title: lessonData.title, content: mdxContent.trim() },
        create: { courseId: course.id, title: lessonData.title, order: lessonData.order, content: mdxContent.trim() },
      })

      for (const questionData of lessonData.questions) {
        const question = await prisma.question.upsert({
          where: { lessonId_order: { lessonId: lesson.id, order: questionData.order } },
          update: { prompt: questionData.prompt },
          create: { lessonId: lesson.id, prompt: questionData.prompt, order: questionData.order },
        })

        await prisma.answer.deleteMany({ where: { questionId: question.id } })
        for (const answerData of questionData.answers) {
          await prisma.answer.create({
            data: { questionId: question.id, text: answerData.text, isCorrect: answerData.isCorrect },
          })
        }
      }

      console.log(`    ✓ ${lessonData.title} (${lessonData.questions.length} questions)`)
    }
  }

  console.log('\n✅ Content sync complete!')
}

syncContent()
  .catch(err => { console.error('❌ Sync failed:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())

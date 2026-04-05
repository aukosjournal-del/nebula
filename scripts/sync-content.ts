import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import matter from 'gray-matter'
import { CourseSchema, LessonFrontmatterSchema } from '../content/schema'

const prisma = new PrismaClient()
const CONTENT_DIR = resolve(__dirname, '../content/courses')

async function syncContent() {
  console.log('🔄 Syncing content to database...\n')

  const courseDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const courseSlug of courseDirs) {
    const courseDir = join(CONTENT_DIR, courseSlug)

    // Parse course.json
    const courseRaw = JSON.parse(readFileSync(join(courseDir, 'course.json'), 'utf-8'))
    const courseData = CourseSchema.parse(courseRaw)

    // Upsert course
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: { title: courseData.title, iconName: courseData.iconName, color: courseData.color, order: courseData.order },
      create: { slug: courseData.slug, title: courseData.title, iconName: courseData.iconName, color: courseData.color, order: courseData.order },
    })

    console.log(`  📚 ${courseData.title} (${course.id})`)

    // Parse MDX lesson files
    const mdxFiles = readdirSync(courseDir)
      .filter(f => f.endsWith('.mdx'))
      .sort()

    for (const mdxFile of mdxFiles) {
      const mdxPath = join(courseDir, mdxFile)
      const raw = readFileSync(mdxPath, 'utf-8')
      const { data: frontmatter, content: mdxContent } = matter(raw)
      const lessonData = LessonFrontmatterSchema.parse(frontmatter)

      // Derive lesson slug from filename (e.g. "01-particules.mdx" → "particules")
      const lessonSlug = mdxFile.replace(/^\d+-/, '').replace('.mdx', '')

      // Upsert lesson
      const lesson = await prisma.lesson.upsert({
        where: { courseId_order: { courseId: course.id, order: lessonData.order } },
        update: { title: lessonData.title, content: mdxContent.trim() },
        create: {
          courseId: course.id,
          title: lessonData.title,
          order: lessonData.order,
          content: mdxContent.trim()
        },
      })

      // Upsert questions and answers
      for (const questionData of lessonData.questions) {
        const question = await prisma.question.upsert({
          where: { lessonId_order: { lessonId: lesson.id, order: questionData.order } },
          update: { prompt: questionData.prompt },
          create: { lessonId: lesson.id, prompt: questionData.prompt, order: questionData.order },
        })

        // Delete existing answers and recreate (simplest idempotent approach)
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

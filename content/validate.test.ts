import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import matter from 'gray-matter'
import { CourseSchema, LessonFrontmatterSchema } from './schema'

const CONTENT_DIR = resolve(__dirname, '.')

describe('Content validation', () => {
  const courseDirs = readdirSync(join(CONTENT_DIR, 'courses'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  it('should have at least one course', () => {
    expect(courseDirs.length).toBeGreaterThan(0)
  })

  it('should have unique course slugs', () => {
    const slugs = courseDirs
    const uniqueSlugs = new Set(slugs)
    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  for (const courseSlug of courseDirs) {
    describe(`Course: ${courseSlug}`, () => {
      const courseDir = join(CONTENT_DIR, 'courses', courseSlug)

      it('should have a valid course.json', () => {
        const courseJsonPath = join(courseDir, 'course.json')
        expect(existsSync(courseJsonPath)).toBe(true)
        const raw = JSON.parse(readFileSync(courseJsonPath, 'utf-8'))
        const result = CourseSchema.safeParse(raw)
        expect(result.success, `Invalid course.json: ${JSON.stringify(result.error?.errors)}`).toBe(true)
        expect(result.data?.slug).toBe(courseSlug)
      })

      it('should have at least one MDX lesson file', () => {
        const mdxFiles = readdirSync(courseDir).filter(f => f.endsWith('.mdx'))
        expect(mdxFiles.length).toBeGreaterThan(0)
      })

      const mdxFiles = readdirSync(courseDir).filter(f => f.endsWith('.mdx')).sort()

      for (const mdxFile of mdxFiles) {
        describe(`Lesson: ${mdxFile}`, () => {
          const mdxPath = join(courseDir, mdxFile)
          const raw = readFileSync(mdxPath, 'utf-8')
          const { data: frontmatter, content } = matter(raw)

          it('should have valid frontmatter', () => {
            const result = LessonFrontmatterSchema.safeParse(frontmatter)
            expect(result.success, `Invalid frontmatter: ${JSON.stringify(result.error?.errors)}`).toBe(true)
          })

          it('should have non-empty content', () => {
            expect(content.trim().length).toBeGreaterThan(50)
          })

          it('should have exactly 3 questions', () => {
            const result = LessonFrontmatterSchema.safeParse(frontmatter)
            if (result.success) {
              expect(result.data.questions.length).toBe(3)
            }
          })

          it('should have exactly 3 answers per question', () => {
            const result = LessonFrontmatterSchema.safeParse(frontmatter)
            if (result.success) {
              for (const q of result.data.questions) {
                expect(q.answers.length).toBe(3)
              }
            }
          })

          it('should have exactly 1 correct answer per question', () => {
            const result = LessonFrontmatterSchema.safeParse(frontmatter)
            if (result.success) {
              for (const q of result.data.questions) {
                const correctCount = q.answers.filter(a => a.isCorrect).length
                expect(correctCount).toBe(1)
              }
            }
          })
        })
      }
    })
  }
})

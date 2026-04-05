import { z } from 'zod'

export const AnswerSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
})

export const QuestionSchema = z.object({
  prompt: z.string().min(1),
  order: z.number().int().min(0),
  answers: z.array(AnswerSchema).length(3),
})

export const LessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().min(1).default(5),
  questions: z.array(QuestionSchema).min(1).max(5),
})

export const CourseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  order: z.number().int().min(0),
})

export type Answer = z.infer<typeof AnswerSchema>
export type Question = z.infer<typeof QuestionSchema>
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>
export type Course = z.infer<typeof CourseSchema>

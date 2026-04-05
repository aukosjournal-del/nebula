import { z } from 'zod'

export const reviewSchema = z.object({
  quality: z.number().int().min(0).max(5),
})

export type ReviewInput = z.infer<typeof reviewSchema>

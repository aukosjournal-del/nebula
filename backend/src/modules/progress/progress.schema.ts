import { z } from 'zod'

export const advanceSchema = z.object({
  answerId: z.string().optional(),
})

export type AdvanceInput = z.infer<typeof advanceSchema>

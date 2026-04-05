import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string().min(3, 'Min. 3 caractères').max(30, 'Max. 30 caractères'),
  password: z.string().min(8, 'Min. 8 caractères'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

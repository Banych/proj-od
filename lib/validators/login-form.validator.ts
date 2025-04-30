import { z } from 'zod'

export const loginFormValidator = z.object({
  username: z
    .string()
    .min(3, { message: 'Логин должен содержать минимум 3 символа' })
    .max(20, { message: 'Логин должен содержать максимум 20 символов' }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(100, { message: 'Пароль должен содержать максимум 24 символов' }),
})

export type LoginFormValidatorType = z.infer<typeof loginFormValidator>

import { z } from 'zod'

export const profileFormValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Имя обязательно для заполнения' })
    .max(50, { message: 'Имя должно содержать максимум 50 символов' }),
  surname: z
    .string()
    .min(1, { message: 'Фамилия обязательна для заполнения' })
    .max(50, { message: 'Фамилия должна содержать максимум 50 символов' }),
  username: z
    .string()
    .min(3, { message: 'Логин должен содержать минимум 3 символа' })
    .max(20, { message: 'Логин должен содержать максимум 20 символов' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        'Логин может содержать только буквы, цифры и символ подчеркивания',
    }),
  email: z
    .string()
    .min(1, { message: 'Email обязателен для заполнения' })
    .email({ message: 'Некорректный формат email' })
    .max(100, { message: 'Email должен содержать максимум 100 символов' }),
  rfRu: z
    .string()
    .max(24, { message: 'RF/RU код должен содержать максимум 24 символа' })
    .optional()
    .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileFormValidator>

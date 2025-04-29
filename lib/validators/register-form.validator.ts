import { z } from 'zod'

export const registerFormValidator = z
    .object({
        username: z
            .string()
            .min(3, { message: 'Логин должен содержать минимум 3 символа' })
            .max(20, { message: 'Логин должен содержать максимум 20 символов' })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message:
                    'Логин может содержать только буквы, цифры и символ подчеркивания',
            }),
        password: z
            .string()
            .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
            .max(100, {
                message: 'Пароль должен содержать максимум 24 символа',
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                {
                    message:
                        'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
                }
            ),
        confirmPassword: z
            .string()
            .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
            .max(100, {
                message: 'Пароль должен содержать максимум 24 символа',
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                {
                    message:
                        'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
                }
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    })

export type RegisterFormValidatorType = z.infer<typeof registerFormValidator>

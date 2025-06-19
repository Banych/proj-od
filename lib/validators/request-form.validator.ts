import { RequestType, SalesOrganizationType } from '@/generated/prisma-client'
import { CreateRequestDTO } from '@/types/dtos'
import { z } from 'zod'

export const requestFormValidator: z.ZodType<CreateRequestDTO> = z.object({
  type: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: 'Выберите тип запроса' }),
  }),
  salesOrganization: z.nativeEnum(SalesOrganizationType, {
    errorMap: () => ({ message: 'Выберите организацию' }),
  }),
  warehouse: z
    .string()
    .min(1, { message: 'Введите номер склада' })
    .max(50, { message: 'Номер склада должен содержать максимум 50 символов' }),
  date: z.date({
    errorMap: () => ({ message: 'Выберите дату' }),
  }),
  comment: z.string().min(1, { message: 'Введите комментарий' }).max(1000, {
    message: 'Комментарий должен содержать максимум 1000 символов',
  }),
  resource: z
    .string()
    .max(100, { message: 'Ресурс должен содержать максимум 100 символов' }),
})

export type RequestFormValidatorType = z.infer<typeof requestFormValidator>

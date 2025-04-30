import { Role } from '@/generated/prisma-client'

export const defaultRoles: {
  text: string
  value: Role
}[] = [
  {
    text: 'Администратор',
    value: Role.ADMIN,
  },
  {
    text: 'Менеджер',
    value: Role.MANAGER,
  },
  {
    text: 'Диспетчер',
    value: Role.DISPATCHER,
  },
]

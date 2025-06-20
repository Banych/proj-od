import { RequestPriority } from '@/generated/prisma-client'

export const defaultPriorities = [
  {
    value: RequestPriority.MEDIUM,
    text: 'Средний',
  },
  {
    value: RequestPriority.HIGH,
    text: 'Высокий',
  },
]

export default defaultPriorities

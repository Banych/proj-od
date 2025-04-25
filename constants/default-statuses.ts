import { RequestStatus } from '@/generated/prisma-client'

const defaultStatuses: {
    value: RequestStatus
    text: string
}[] = [
    { value: RequestStatus.CREATED, text: 'Создан' },
    { value: RequestStatus.COMPLETED, text: 'Выполнен' },
    { value: RequestStatus.INCORRECT, text: 'Некорректен' },
]

export default defaultStatuses

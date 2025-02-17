import { RequestDTOStatus } from '@/types/dtos'

const defaultStatuses: {
    value: RequestDTOStatus
    text: string
}[] = [
    { value: 'created', text: 'Создан' },
    { value: 'completed', text: 'Выполнен' },
    { value: 'incorrect', text: 'Некорректен' },
]

export default defaultStatuses

import { RequestTypeDTO } from '@/types/dtos'

const defaultRequestTypes: {
    text: string
    value: RequestTypeDTO
}[] = [
    {
        text: 'Доставка день в день',
        value: 'OneDayDelivery',
    },
    {
        text: 'Коррекционная продажа',
        value: 'CorrectionSale',
    },
    {
        text: 'Коррекционный возврат',
        value: 'CorrectionReturn',
    },
    {
        text: 'Сэмплинг / Выкуп / Самовывоз',
        value: 'Sampling',
    },
]

export default defaultRequestTypes

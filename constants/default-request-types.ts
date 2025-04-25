import { RequestType } from '@/generated/prisma-client'

const defaultRequestTypes: {
    text: string
    value: RequestType
}[] = [
    {
        text: 'Доставка день в день',
        value: RequestType.ONE_DAY_DELIVERY,
    },
    {
        text: 'Коррекционная продажа',
        value: RequestType.CORRECTION_SALE,
    },
    {
        text: 'Коррекционный возврат',
        value: RequestType.CORRECTION_RETURN,
    },
    {
        text: 'Сэмплинг / Выкуп / Самовывоз',
        value: RequestType.SAMPLING,
    },
]

export default defaultRequestTypes

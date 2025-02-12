import { MessageDTO, RequestDTO } from '@/types/dtos'
import { FC } from 'react'

type RequestDetailsProps = {
    item: RequestDTO
    messages?: MessageDTO[]
}

const RequestDetails: FC<RequestDetailsProps> = ({ item }) => {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl">Запрос №{item.id}</h3>

            <div className="grid auto-rows-auto grid-cols-4 gap-2">
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Тип запроса:</div>
                    <div>{item.type}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Организация:</div>
                    <div>{item.salesOrganization}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Склад:</div>
                    <div>{item.warehouse}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Дата:</div>
                    <div>{item.date}</div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="font-bold">ОД/Текс</div>
                <div>{item.comment}</div>
            </div>

            <div className="flex flex-col gap-2"></div>
        </div>
    )
}

export default RequestDetails

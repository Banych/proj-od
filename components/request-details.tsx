import Messages from '@/components/messages'
import defaultRequestTypes from '@/constants/default-request-types'
import { MessageWithUserDTO, RequestDTO } from '@/types/dtos'
import { FC } from 'react'

type RequestDetailsProps = {
    item: RequestDTO
    messages?: MessageWithUserDTO[]
}

const RequestDetails: FC<RequestDetailsProps> = ({ item, messages }) => {
    const formattedType = defaultRequestTypes.find(
        (type) => type.value === item.type
    )?.text

    return (
        <div className="flex flex-col gap-4 pb-4">
            <h3 className="text-2xl font-bold">Запрос №{item.id}</h3>

            <div className="grid auto-rows-auto grid-cols-4 gap-2">
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Тип запроса:</div>
                    <div>{formattedType}</div>
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

            <div className="flex flex-col gap-2 pb-4">
                <div className="font-bold">ОД/Текс</div>
                <div>{item.comment}</div>
            </div>

            <Messages messages={messages || []} requestId={item.id} />
        </div>
    )
}

export default RequestDetails

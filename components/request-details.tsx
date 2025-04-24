import { TriangleAlert } from 'lucide-react'
import { FC } from 'react'

import Messages from '@/components/messages'
import RequestActions from '@/components/request-actions'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { getTypeName } from '@/lib/utils'
import { MessageWithUserDTO, RequestDTO, UserDTO } from '@/types/dtos'

type RequestDetailsProps = {
    item: RequestDTO
    user: UserDTO
    messages?: MessageWithUserDTO[]
}

const RequestDetails: FC<RequestDetailsProps> = ({ item, messages, user }) => {
    const formattedType = getTypeName(item.type)

    return (
        <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-4 text-2xl font-bold">
                    Запрос №{item.id}
                    {item.status === 'incorrect' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TriangleAlert className="size-6 text-orange-700" />
                            </TooltipTrigger>
                            <TooltipContent className="text-base font-normal">
                                Запрос некорректен
                            </TooltipContent>
                        </Tooltip>
                    )}
                </h3>
                <RequestActions item={item} user={user} />
            </div>

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

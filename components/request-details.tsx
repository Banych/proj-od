import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

import Messages from '@/components/messages'
import { Button } from '@/components/ui/button'
import { getTypeName } from '@/lib/utils'
import { MessageWithUserDTO, RequestDTO, UserDTO } from '@/types/dtos'

type RequestDetailsProps = {
    item: RequestDTO
    user: UserDTO
    messages?: MessageWithUserDTO[]
}

const RequestDetails: FC<RequestDetailsProps> = ({ item, messages, user }) => {
    const formattedType = getTypeName(item.type)

    const isEditVisible =
        user.role === 'Admin' ||
        user.role === 'Dispatcher' ||
        user.id === item.userId

    return (
        <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-4 text-2xl font-bold">
                    Запрос №{item.id}
                    {item.status === 'incorrect' && (
                        <TriangleAlert className="size-6 text-orange-700" />
                    )}
                </h3>
                {isEditVisible && (
                    <div className="flex items-center gap-2">
                        <Link href={`/requests/${item.id}/edit`}>
                            <Button variant="outline">Редактировать</Button>
                        </Link>
                    </div>
                )}
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

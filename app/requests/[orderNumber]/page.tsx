import { FC } from 'react'

import RequestDetails from '@/components/request-details'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { MessageWithUser, RequestWithUser } from '@/types/dtos'
import { notFound } from 'next/navigation'

type RequestPageProps = {
    params: {
        orderNumber: string
    }
}

// export const cache = 'force-no-store'

const RequestPage: FC<RequestPageProps> = async props => {
    const params = await props.params;
    const { orderNumber } = params

    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const orderNumberInt = parseInt(orderNumber, 10)
    if (isNaN(orderNumberInt) || orderNumberInt <= 0) {
        return notFound()
    }

    const requestItem = (await db.request.findUnique({
        where: {
            orderNumber: orderNumberInt,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    name: true,
                    surname: true,
                    email: true,
                },
            },
        },
    })) as RequestWithUser

    const messages = (await db.message.findMany({
        where: {
            requestId: requestItem.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    name: true,
                    surname: true,
                    email: true,
                },
            },
        },
    })) as MessageWithUser[]

    return (
        <ScrollArea>
            <RequestDetails
                item={requestItem}
                messages={messages}
                user={dbUser}
            />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default RequestPage

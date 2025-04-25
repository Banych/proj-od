import { FC } from 'react'

import RequestDetails from '@/components/request-details'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { MessageWithUser, RequestWithUser } from '@/types/dtos'

type RequestPageProps = {
    params: {
        id: string
    }
}

export const cache = 'force-no-store'

const RequestPage: FC<RequestPageProps> = async ({ params }) => {
    const { id } = params

    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const requestItem = (await db.request.findUnique({
        where: {
            id,
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
            requestId: id,
        },
        orderBy: {
            createdAt: 'asc',
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

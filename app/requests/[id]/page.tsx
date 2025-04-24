import { compareDesc } from 'date-fns'
import { FC } from 'react'

import RequestDetails from '@/components/request-details'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import getSessionUser from '@/lib/get-session-user'
import { MessageWithUserDTO } from '@/types/dtos'

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

    const requestItem = await requestsClient.getRequest(id)

    const messages: MessageWithUserDTO[] = await messagesClient
        .getMessagesWithUser({
            requestId: id,
        })
        .then((messages: MessageWithUserDTO[]) =>
            messages.sort((a, b) => {
                return compareDesc(new Date(a.date), new Date(b.date))
            })
        )

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

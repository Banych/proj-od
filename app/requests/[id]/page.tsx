import RequestDetails from '@/components/request-details'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import { MessageWithUserDTO } from '@/types/dtos'
import { compareDesc } from 'date-fns'
import { FC } from 'react'

type RequestPageProps = {
    params: {
        id: string
    }
}

const RequestPage: FC<RequestPageProps> = async ({ params }) => {
    const { id } = params

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
            <RequestDetails item={requestItem} messages={messages} />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default RequestPage

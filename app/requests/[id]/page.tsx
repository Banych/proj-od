import RequestDetails from '@/components/request-details'
import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import { MessageDTO, RequestDTO } from '@/types/dtos'
import { FC } from 'react'

type RequestPageProps = {
    params: {
        id: string
    }
}

const RequestPage: FC<RequestPageProps> = async ({ params }) => {
    const { id } = params

    const requestItem = await requestsClient.getRequest(id)

    const messages: MessageDTO[] = await messagesClient.getMessages({
        requestId: id,
    })

    return <RequestDetails item={requestItem} messages={messages} />
}

export default RequestPage

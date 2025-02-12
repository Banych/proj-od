import RequestDetails from '@/components/request-details'
import { MessageDTO, RequestDTO } from '@/types/dtos'
import { FC } from 'react'

type RequestPageProps = {
    params: {
        id: string
    }
}

const RequestPage: FC<RequestPageProps> = async ({ params }) => {
    const { id } = params

    const request = await fetch(`http://localhost:3000/api/requests/${id}`, {
        method: 'GET',
    })

    const requestItem: RequestDTO = await request.json()

    const messagesResponse = await fetch(
        `http://localhost:3000/api/messages?requestId=${id}`,
        {
            method: 'GET',
        }
    )

    const messages: MessageDTO[] = await messagesResponse.json()

    return <RequestDetails item={requestItem} messages={messages} />
}

export default RequestPage

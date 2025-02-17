import RequestsList from '@/components/requests-list'
import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import getSessionUser from '@/lib/get-session-user'
import { MessageDTO, RequestDTO } from '@/types/dtos'

const MyRequests = async () => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const role = dbUser.role

    const requests: RequestDTO[] = []

    if (role === 'Admin' || role === 'Dispatcher') {
        const messages: MessageDTO[] = await messagesClient.getMessages({
            userId: dbUser.id,
        })

        const requestIds = messages.map((message) => `id=${message.requestId}`)

        const result = await requestsClient.getRequests({
            ids: requestIds.join('&'),
            status_ne: 'completed',
        })

        requests.push(...result)
    } else {
        const result = await requestsClient.getRequests({
            userId: dbUser.id,
            status_ne: 'completed',
        })

        requests.push(...result)
    }

    return <RequestsList initialRequests={requests} forceUseInitialRequests />
}

export default MyRequests

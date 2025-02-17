import messagesClient from '@/lib/db-clients/messages.client'
import { CreateRequestDTO, MessageDTO, RequestDTO } from '@/types/dtos'

const DEFAULT_API_URL = 'http://localhost:8000'

export default {
    getRequests: async (
        params: Record<string, string>
    ): Promise<RequestDTO[]> => {
        const query = new URLSearchParams(params).toString()
        const result = await fetch(DEFAULT_API_URL + '/requests?' + query, {
            cache: 'no-cache',
        })
        return result.json()
    },
    getRequest: async (id: string): Promise<RequestDTO> => {
        const result = await fetch(DEFAULT_API_URL + `/requests/${id}`, {
            cache: 'no-cache',
        })
        return result.json()
    },
    createRequest: async (request: RequestDTO): Promise<RequestDTO> => {
        const result = await fetch(DEFAULT_API_URL + '/requests', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
        return result.json()
    },
    deleteRequest: async (id: string): Promise<void> => {
        const messages: MessageDTO[] = await messagesClient.getMessages({
            requestId: id,
        })
        const promisesToDelete = messages.map((message) =>
            fetch(DEFAULT_API_URL + `/messages/${message.id}`, {
                method: 'DELETE',
                cache: 'no-cache',
            })
        )

        await Promise.all([
            await fetch(DEFAULT_API_URL + `/requests/${id}`, {
                method: 'DELETE',
                cache: 'no-cache',
            }),
            ...promisesToDelete,
        ])
    },
    updateRequest: async (
        id: string,
        request: CreateRequestDTO
    ): Promise<RequestDTO> => {
        const result = await fetch(DEFAULT_API_URL + `/requests/${id}`, {
            method: 'PATCH',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
        return result.json()
    },
}

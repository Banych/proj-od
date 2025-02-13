import { RequestDTO } from '@/types/dtos'

const DEFAULT_API_URL = 'http://localhost:8000'

export default {
    getRequests: async (
        params: Record<string, string>
    ): Promise<RequestDTO[]> => {
        const query = new URLSearchParams(params).toString()
        const result = await fetch(DEFAULT_API_URL + '/requests?' + query)
        return result.json()
    },
    getRequest: async (id: string): Promise<RequestDTO> => {
        const result = await fetch(DEFAULT_API_URL + `/requests/${id}`)
        return result.json()
    },
    createRequest: async (request: RequestDTO): Promise<RequestDTO> => {
        const result = await fetch(DEFAULT_API_URL + '/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
        return result.json()
    },
    deleteRequest: async (id: string): Promise<void> => {
        await fetch(DEFAULT_API_URL + `/requests/${id}`, {
            method: 'DELETE',
        })
    },
}

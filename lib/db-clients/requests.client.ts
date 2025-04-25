import axios from 'axios'

import { RequestWithUser } from '@/types/dtos'

export default {
    getPaginatedRequests: async (
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        page: number,
        limit: number,
        params: Record<string, string | string[] | undefined>
    ): Promise<RequestWithUser[]> => {
        const query = new URLSearchParams({
            sortBy,
            sortOrder,
            page: String(page),
            limit: String(limit),
        })

        if (params.status) {
            query.append('status', JSON.stringify(params.status))
        }

        const { data } = await axios.get('/api/requests?' + query)
        return data
    },
}

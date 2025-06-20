import axios from 'axios'

import { RequestWithUser } from '@/types/dtos'
import { format } from 'date-fns'

const client = {
  getPaginatedRequests: async (
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    page: number,
    limit: number,
    params: Record<string, string | string[] | Date | undefined | null>
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

    if (params.orderNumber) {
      query.append('orderNumber', String(params.orderNumber))
    }

    if (params.dateFrom) {
      query.append('dateFrom', format(params.dateFrom as Date, 'yyyy-MM-dd'))
    }

    if (params.dateTo) {
      query.append('dateTo', format(params.dateTo as Date, 'yyyy-MM-dd'))
    }

    if (params.createdAtFrom) {
      query.append(
        'createdAtFrom',
        format(params.createdAtFrom as Date, 'yyyy-MM-dd')
      )
    }

    if (params.createdAtTo) {
      query.append(
        'createdAtTo',
        format(params.createdAtTo as Date, 'yyyy-MM-dd')
      )
    }

    if (params.type) {
      query.append('type', String(params.type))
    }

    if (params.salesOrganization) {
      query.append('salesOrganization', String(params.salesOrganization))
    }

    if (params.warehouse) {
      query.append('warehouse', String(params.warehouse))
    }

    if (params.rfRu) {
      query.append('rfRu', String(params.rfRu))
    }

    const { data } = await axios.get('/api/requests?' + query)
    return data
  },
}

export default client

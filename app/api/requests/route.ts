import requestsClient from '@/lib/db-clients/requests.client'
import { RequestDTO } from '@/types/dtos'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const body = (await request.json()) as RequestDTO

    const lastRequest = await requestsClient.getRequests({
        _sort: 'id',
        limit: '1',
    })

    const lastId = lastRequest.length ? lastRequest[0].id : 0

    requestsClient.createRequest({
        ...body,
        id: (Number(lastId) + 1).toString(),
    })

    return NextResponse.json(body)
}

export async function GET() {
    console.log('GET /api/requests')
    const requests = await requestsClient.getRequests({})

    return NextResponse.json(requests)
}

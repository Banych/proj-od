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

    const result = await requestsClient.createRequest({
        ...body,
        id: (Number(lastId) + 1).toString(),
    })

    console.log('Request is created :::::', result)

    return NextResponse.json(result)
}

export async function GET() {
    try {
        const requests = await requestsClient.getRequests({})
        console.log('requests response ::::', requests)
        return NextResponse.json(requests)
    } catch (error) {
        console.error('Error fetching requests:', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'

import requestsClient from '@/lib/db-clients/requests.client'
import getSessionUser from '@/lib/get-session-user'
import { RequestDTO } from '@/types/dtos'

export async function POST(request: NextRequest) {
    const body = (await request.json()) as RequestDTO
    const user = await getSessionUser()

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const lastRequest = await requestsClient.getRequests({})

    const lastId = lastRequest.length
        ? lastRequest
              .map((request) => request.id)
              .sort((a, b) => Number(b) - Number(a))[0]
        : 0

    const result = await requestsClient.createRequest({
        ...body,
        id: (Number(lastId) + 1).toString(),
        status: 'created',
        userId: user.id,
    })

    return NextResponse.json(result)
}

export async function GET() {
    try {
        const requests = await requestsClient.getRequests({})
        return NextResponse.json(requests)
    } catch (error) {
        console.error('Error fetching requests:', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'

import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import { MessageDTO } from '@/types/dtos'

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { requestId: string } }>
) {
    const { requestId } = (await params).params

    const messages: MessageDTO[] = await messagesClient.getMessages({
        requestId,
    })

    return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
    const { requestId, message, userId, needCorrection } = await request.json()

    const createdMessage = await messagesClient.createMessage({
        message,
        requestId,
        userId,
        date: new Date().toISOString(),
    })

    const requestToUpdate = await requestsClient.getRequest(requestId)

    if (needCorrection) {
        await requestsClient.updateRequest(requestId, {
            ...requestToUpdate,
            status: 'incorrect',
        })
    }

    return NextResponse.json(createdMessage)
}

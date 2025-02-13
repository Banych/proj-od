import messagesClient from '@/lib/db-clients/messages.client'
import { MessageDTO } from '@/types/dtos'
import { NextRequest, NextResponse } from 'next/server'

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
    const { requestId, message, userId } = await request.json()

    const createdMessage = await messagesClient.createMessage({
        message,
        requestId,
        userId,
        date: new Date().toISOString(),
    })

    return NextResponse.json(createdMessage)
}

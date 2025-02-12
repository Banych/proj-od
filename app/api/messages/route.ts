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

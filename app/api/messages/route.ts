import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { requestId: string } }>
) {
    const { requestId } = (await params).params

    const messages = await db.message.findMany({
        where: {
            requestId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    name: true,
                    surname: true,
                    email: true,
                },
            },
        },
    })

    if (!messages) {
        return NextResponse.json('No messages found', { status: 404 })
    }

    return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
    const { requestId, message, userId, needCorrection } = await request.json()

    const createdMessage = await db.message.create({
        data: {
            requestId,
            message,
            userId,
        },
    })

    if (needCorrection) {
        await db.request.update({
            where: {
                id: requestId,
            },
            data: {
                status: 'INCORRECT',
            },
        })
    }

    return NextResponse.json(createdMessage)
}

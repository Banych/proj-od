import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function DELETE(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    await db.request.delete({
        where: {
            id,
        },
    })

    return NextResponse.json({ id })
}

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    const requestItem = await db.request.findUnique({
        where: {
            id,
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

    return NextResponse.json(requestItem)
}

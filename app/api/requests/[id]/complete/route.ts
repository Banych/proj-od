import { db } from '@/lib/db'
import { RequestStatus } from '@/lib/generated/prisma'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    await db.request.update({
        where: {
            id,
        },
        data: {
            status: RequestStatus.COMPLETED,
        },
    })

    return NextResponse.json('ok', {
        status: 200,
    })
}

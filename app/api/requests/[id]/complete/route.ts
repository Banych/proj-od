import requestsClient from '@/lib/db-clients/requests.client'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    await requestsClient.updateRequest(id, {
        status: 'completed',
    })

    return NextResponse.json('ok', {
        status: 200,
    })
}

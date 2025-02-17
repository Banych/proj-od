import { NextRequest, NextResponse } from 'next/server'

import requestsClient from '@/lib/db-clients/requests.client'

export async function DELETE(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    await requestsClient.deleteRequest(id)

    return NextResponse.json({ id })
}

export async function GET(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params

    const requestItem = await requestsClient.getRequest(id)

    return NextResponse.json(requestItem)
}

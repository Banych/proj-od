import { db } from '@/lib/db'
import { RequestStatus } from '@/generated/prisma-client'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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

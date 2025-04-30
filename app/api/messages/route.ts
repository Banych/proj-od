import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

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

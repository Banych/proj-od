import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { name, surname, email, username, rfRu } = await request.json()

  try {
    const response = await db.user.update({
      where: { id },
      data: {
        name,
        surname,
        email,
        username,
        rfRu,
      },
    })

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json(await response, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update user', message: (error as Error).message },
      { status: 500 }
    )
  }
}

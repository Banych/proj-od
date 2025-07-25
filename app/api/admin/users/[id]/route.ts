import { Role } from '@/generated/prisma-client'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { name, surname, username, email, role } = z
      .object({
        name: z.string().optional(),
        surname: z.string().optional(),
        username: z.string().optional(),
        email: z.string().optional(),
        role: z.enum([Role.ADMIN, Role.DISPATCHER, Role.MANAGER]).optional(),
      })
      .parse({
        ...body,
      })

    const user = await getSessionUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        name,
        surname,
        username,
        email,
        role,
      },
    })

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await getSessionUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    })

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'Failed to delete user' },
        { status: 500 }
      )
    }

    return NextResponse.json(deletedUser, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Failed to delete user', error: (error as Error).message },
      { status: 500 }
    )
  }
}

import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { Role } from '@/generated/prisma-client'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: {
        username,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this username already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      username,
      password: hashedPassword,
      role: Role.DISPATCHER,
    }

    const response = await db.user.create({
      data: newUser,
    })

    if (!response) {
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in registration:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

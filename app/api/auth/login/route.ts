import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: {
        username,
      },
    })
    if (!user) {
      return NextResponse.json({ message: 'Invalid username' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    if (!process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.NEXTAUTH_SECRET,
      {
        expiresIn: '1h',
      }
    )

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

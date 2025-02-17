import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

import usersClient from '@/lib/db-clients/users.client'

const API_URL = 'http://localhost:8000/users'

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json()

        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username and password are required' },
                { status: 400 }
            )
        }

        const existingUser = await usersClient.getUserByUsername(username)
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this username already exists' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            role: 'Manager',
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })

        if (!response.ok) {
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

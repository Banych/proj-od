import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params
    const { name, surname, email, username } = await request.json()

    try {
        const response = await db.user.update({
            where: { id },
            data: {
                name,
                surname,
                email,
                username,
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
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

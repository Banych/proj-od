import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    params: Promise<{ params: { id: string } }>
) {
    const { id } = (await params).params
    const { name, surname, email, username } = await request.json()

    try {
        const response = await fetch(`http://localhost:8000/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, email, username }),
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to update user' },
                { status: 500 }
            )
        }

        return NextResponse.json(await response.json(), { status: 200 })
    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

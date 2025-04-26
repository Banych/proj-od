import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const url = new URL(request.url)
        const {
            page,
            limit,
            name,
            surname,
            username,
            email,
            orderBy,
            orderDirection,
        } = z
            .object({
                page: z.string().optional().default('1'),
                limit: z.string().optional().default('10'),
                name: z.string().nullish().optional(),
                surname: z.string().nullish().optional(),
                username: z.string().nullish().optional(),
                email: z.string().nullish().optional(),
                orderBy: z.string().nullish().optional(),
                orderDirection: z.enum(['asc', 'desc']).nullish().optional(),
            })
            .parse({
                page: url.searchParams.get('page'),
                limit: url.searchParams.get('limit'),
                name: url.searchParams.get('name'),
                surname: url.searchParams.get('surname'),
                username: url.searchParams.get('username'),
                email: url.searchParams.get('email'),
                orderBy: url.searchParams.get('orderBy'),
                orderDirection: url.searchParams.get('orderDirection'),
            })

        const users = await db.user.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: name || undefined,
                            mode: 'insensitive',
                        },
                    },
                    {
                        surname: {
                            contains: surname || undefined,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: username || undefined,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: email || undefined,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: {
                [orderBy || 'createdAt']: orderDirection || 'asc',
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            select: {
                id: true,
                username: true,
                role: true,
                name: true,
                surname: true,
                email: true,
                createdAt: true,
            },
        })

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: 'No users found' },
                { status: 404 }
            )
        }

        return NextResponse.json(users)
    } catch (error: unknown) {
        console.error('Error fetching users:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid query parameters' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Error fetching users' },
            { status: 500 }
        )
    }
}

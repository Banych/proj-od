import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { CreateRequestDTO } from '@/types/dtos'
import { RequestStatus, Role } from '@/lib/generated/prisma'

export async function POST(request: NextRequest) {
    const body = (await request.json()) as CreateRequestDTO
    const user = await getSessionUser()

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const result = await db.request.create({
        data: {
            ...body,
            userId: user.id,
        },
    })

    if (!result) {
        return NextResponse.json('Failed to create request', { status: 500 })
    }

    return NextResponse.json(result)
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url)

    try {
        const { sortBy, sortOrder, page, limit, status } = z
            .object({
                sortBy: z.string().optional(),
                sortOrder: z.enum(['asc', 'desc']).optional(),
                page: z.string(),
                limit: z.string(),
                status: z
                    .array(
                        z.enum([
                            RequestStatus.CREATED,
                            RequestStatus.COMPLETED,
                            RequestStatus.INCORRECT,
                        ])
                    )
                    .optional()
                    .nullable(),
            })
            .parse({
                sortBy: url.searchParams.get('sortBy'),
                sortOrder: url.searchParams.get('sortOrder'),
                page: url.searchParams.get('page'),
                limit: url.searchParams.get('limit'),
                status: JSON.parse(url.searchParams.get('status') ?? '[]'),
            })

        const user = await getSessionUser()

        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        let whereClause = {}

        if (user.role === Role.DISPATCHER) {
            const requestIdsFromMessages = (
                await db.message.findMany({
                    where: {
                        userId: user.id,
                        request: {
                            status: {
                                in: status || undefined,
                            },
                        },
                    },
                    select: {
                        requestId: true,
                    },
                })
            ).map((message) => message.requestId)

            whereClause = {
                ...whereClause,
                OR: [
                    { id: { in: requestIdsFromMessages } },
                    { status: { in: status || undefined } },
                ],
            }
        } else if (user.role === Role.MANAGER) {
            whereClause = {
                ...whereClause,
                userId: user.id,
            }
        }

        if (status) {
            whereClause = { ...whereClause, status: { in: status } }
        }

        const requests = await db.request.findMany({
            where: whereClause,
            orderBy: {
                [sortBy || 'createdAt']: sortOrder || 'desc',
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
            },
        })
        return NextResponse.json(requests)
    } catch (error) {
        console.error('Error fetching requests:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Invalid query parameters' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

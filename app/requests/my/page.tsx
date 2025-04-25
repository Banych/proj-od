import RequestsList from '@/components/requests-list'
import { db } from '@/lib/db'
import { RequestStatus, Role } from '@/generated/prisma-client'
import getSessionUser from '@/lib/get-session-user'
import { RequestWithUser } from '@/types/dtos'
import { FC } from 'react'

type MyRequestsProps = {
    searchParams?: Promise<{
        sortBy: string
        sortOrder: 'asc' | 'desc'
        page: number
        limit: number
    }>
}

const MyRequests: FC<MyRequestsProps> = async ({ searchParams }) => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const requests: RequestWithUser[] = []
    const excludeStatus = RequestStatus.COMPLETED

    const params = await searchParams

    const sortBy = params?.sortBy || 'orderNumber'
    const sortOrder = params?.sortOrder || 'desc'
    const page = params?.page || 1
    const limit = params?.limit || 10

    if (dbUser.role === Role.DISPATCHER) {
        const requestIds = (
            await db.message.findMany({
                where: {
                    request: {
                        NOT: {
                            status: excludeStatus || undefined,
                        },
                    },
                },
                include: {
                    request: { select: { id: true } },
                },
            })
        ).map((message) => message.request.id)

        const result = await db.request.findMany({
            where: {
                OR: [
                    { id: { in: requestIds } },
                    { status: { not: RequestStatus.COMPLETED } },
                ],
            },
            orderBy: {
                [sortBy || 'orderNumber']: sortOrder || 'desc',
            },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        surname: true,
                        username: true,
                    },
                },
            },
        })

        requests.push(...result)
    } else if (dbUser.role === Role.MANAGER) {
        const result = await db.request.findMany({
            where: {
                userId: dbUser.id,
                NOT: {
                    status: excludeStatus || undefined,
                },
            },
            orderBy: {
                [sortBy || 'orderNumber']: sortOrder || 'desc',
            },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        surname: true,
                        username: true,
                    },
                },
            },
        })

        requests.push(...result)
    } else if (dbUser.role === Role.ADMIN) {
        const result = await db.request.findMany({
            where: {
                NOT: {
                    status: excludeStatus || undefined,
                },
            },
            orderBy: {
                [sortBy || 'orderNumber']: sortOrder || 'desc',
            },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        surname: true,
                        username: true,
                    },
                },
            },
        })

        requests.push(...result)
    }

    return (
        <RequestsList
            id="my-requests"
            initialRequests={requests}
            user={dbUser}
            excludeStatus={excludeStatus}
        />
    )
}

export default MyRequests

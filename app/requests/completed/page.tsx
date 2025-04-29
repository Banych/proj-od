import { FC } from 'react'

import RequestsList from '@/components/requests-list'
import { RequestStatus, Role } from '@/generated/prisma-client'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { RequestWithUser } from '@/types/dtos'

type CompletedRequestsPageProps = {
    searchParams?: Promise<{
        sortBy: string
        sortOrder: 'asc' | 'desc'
        page: number
        limit: number
    }>
}

const CompletedRequestsPage: FC<CompletedRequestsPageProps> = async ({
    searchParams,
}) => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const role = dbUser.role

    const requests: RequestWithUser[] = []
    const status = RequestStatus.COMPLETED

    const params = await searchParams

    const sortBy = params?.sortBy || 'orderNumber'
    const sortOrder = params?.sortOrder || 'desc'
    const page = params?.page || 1
    const limit = params?.limit || 10

    if (role === Role.DISPATCHER) {
        const requestIds = (
            await db.message.findMany({
                where: {
                    request: {
                        status: status || undefined,
                    },
                },
                include: {
                    request: { select: { id: true } },
                },
            })
        ).map((message) => message.request.id)

        const result = await db.request.findMany({
            where: {
                id: { in: requestIds },
                status: status || undefined,
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
    } else if (role === Role.ADMIN) {
        const requestsIds = await db.request.findMany({
            where: {
                status,
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

        requests.push(...requestsIds)
    } else if (role === Role.MANAGER) {
        const result = await db.request.findMany({
            where: {
                userId: dbUser.id,
                status: status || undefined,
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
            id="completed-requests"
            initialRequests={requests}
            user={dbUser}
            status={status}
        />
    )
}

export default CompletedRequestsPage

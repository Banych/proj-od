import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  RequestStatus,
  RequestType,
  Role,
  SalesOrganizationType,
} from '@/generated/prisma-client'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { CreateRequestDTO } from '@/types/dtos'
import { endOfDay, parse, startOfDay } from 'date-fns'

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
    const {
      sortBy,
      sortOrder,
      page,
      limit,
      status,
      orderNumber,
      dateFrom,
      dateTo,
      createdAtFrom,
      createdAtTo,
      type,
      salesOrganization,
      warehouse,
      rfRu,
    } = z
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
        orderNumber: z.string().nullable(),
        dateFrom: z.string().nullable(),
        dateTo: z.string().nullable(),
        createdAtFrom: z.string().nullable(),
        createdAtTo: z.string().nullable(),
        type: z
          .enum([
            RequestType.CORRECTION_RETURN,
            RequestType.CORRECTION_SALE,
            RequestType.ONE_DAY_DELIVERY,
            RequestType.SAMPLING,
          ])
          .nullable(),
        salesOrganization: z
          .enum([
            SalesOrganizationType.SALES_3801,
            SalesOrganizationType.SALES_3802,
            SalesOrganizationType.SALES_3803,
            SalesOrganizationType.SALES_3804,
            SalesOrganizationType.SALES_3805,
            SalesOrganizationType.SALES_3806,
          ])
          .nullable(),
        warehouse: z.string().nullable(),
        rfRu: z.string().nullable(),
      })
      .parse({
        sortBy: url.searchParams.get('sortBy'),
        sortOrder: url.searchParams.get('sortOrder'),
        page: url.searchParams.get('page'),
        limit: url.searchParams.get('limit'),
        status: JSON.parse(url.searchParams.get('status') ?? '[]'),
        orderNumber: url.searchParams.get('orderNumber'),
        dateFrom: url.searchParams.get('dateFrom'),
        dateTo: url.searchParams.get('dateTo'),
        createdAtFrom: url.searchParams.get('createdAtFrom'),
        createdAtTo: url.searchParams.get('createdAtTo'),
        type: url.searchParams.get('type'),
        salesOrganization: url.searchParams.get('salesOrganization'),
        warehouse: url.searchParams.get('warehouse'),
        rfRu: url.searchParams.get('rfRu'),
      })

    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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

    if (orderNumber) {
      whereClause = { ...whereClause, orderNumber: parseInt(orderNumber, 10) }
    }

    if (dateFrom) {
      whereClause = {
        ...whereClause,
        date: {
          gte: startOfDay(parse(dateFrom, 'yyyy-MM-dd', new Date())),
        },
      }
    }

    if (dateTo) {
      whereClause = {
        ...whereClause,
        date: {
          ...('date' in whereClause && typeof whereClause.date === 'object'
            ? whereClause.date
            : {}),
          lte: endOfDay(parse(dateTo, 'yyyy-MM-dd', new Date())),
        },
      }
    }

    if (createdAtFrom) {
      whereClause = {
        ...whereClause,
        createdAt: {
          gte: startOfDay(parse(createdAtFrom, 'yyyy-MM-dd', new Date())),
        },
      }
    }

    if (createdAtTo) {
      whereClause = {
        ...whereClause,
        createdAt: {
          ...('createdAt' in whereClause &&
          typeof whereClause.createdAt === 'object'
            ? whereClause.createdAt
            : {}),
          lte: endOfDay(parse(createdAtTo, 'yyyy-MM-dd', new Date())),
        },
      }
    }

    if (type) {
      whereClause = { ...whereClause, type }
    }

    if (salesOrganization) {
      whereClause = {
        ...whereClause,
        salesOrganization,
      }
    }

    if (warehouse) {
      whereClause = { ...whereClause, warehouse: { contains: warehouse } }
    }

    if (rfRu) {
      whereClause = {
        ...whereClause,
        user: {
          rfRu: { contains: rfRu, mode: 'insensitive' },
        },
      }
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
            rfRu: true,
          },
        },
      },
    })
    return NextResponse.json(requests)
  } catch (error) {
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

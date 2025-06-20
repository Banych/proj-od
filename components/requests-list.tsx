'use client'

import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowDown, BookCheck, Loader2 } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import RequestListItem from '@/components/request-list-item'
import TableHeaderCell from '@/components/table-header-cell'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants/lists-constants'
import { RequestStatus } from '@/generated/prisma-client'
import useRequestFilters from '@/hooks/use-request-filters'
import requestsClient from '@/lib/db-clients/requests.client'
import { RequestWithUser, UserDTO } from '@/types/dtos'

type RequestsListProps = {
  user: UserDTO
  initialRequests?: RequestWithUser[]
  status?: RequestStatus
  excludeStatus?: RequestStatus
  id?: string
}

const RequestsList: FC<RequestsListProps> = ({
  user,
  initialRequests = [],
  status,
  excludeStatus,
  id,
}) => {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'orderNumber'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    () => (searchParams.get('sortOrder') as 'asc' | 'desc' | null) || 'desc'
  )
  const lastRequestRef = useRef<HTMLDivElement | null>(null)
  const { push } = useRouter()
  const pathname = usePathname()
  const { filters, resetFilters } = useRequestFilters()

  const { entry, ref } = useIntersection({
    root: lastRequestRef.current,
    threshold: 0.5,
  })

  const appliedStatus: string[] = status
    ? [status]
    : [
        RequestStatus.CREATED,
        RequestStatus.COMPLETED,
        RequestStatus.INCORRECT,
      ].filter((s) => s !== excludeStatus)

  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['requests', sortBy, sortOrder, id, appliedStatus, filters],
      queryFn: ({ pageParam = 1 }) => {
        return requestsClient.getPaginatedRequests(
          sortBy,
          sortOrder as 'asc' | 'desc',
          pageParam,
          INFINITE_SCROLLING_PAGINATION_RESULTS,
          {
            status: appliedStatus,
            ...filters,
          }
        )
      },
      getNextPageParam: (lastPage, pages, lastPageParams) => {
        if (lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) {
          return undefined
        }
        return lastPageParams + 1
      },
      initialPageParam: 1,
      initialData: {
        pages: [initialRequests],
        pageParams: [1],
      },
    })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage, hasNextPage])

  useEffect(() => {
    if (sortBy && sortOrder) {
      push(`${pathname}?sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        scroll: false,
      })
    }
  }, [pathname, push, sortBy, sortOrder])

  const onSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSortBy(sortBy)
    setSortOrder(sortOrder)
  }, [])

  useEffect(() => {
    return () => {
      if (lastRequestRef.current) {
        lastRequestRef.current = null
      }

      resetFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requests = data?.pages.flatMap((page) => page) || []

  return (
    <ScrollArea className="grow">
      <div className="grid auto-rows-auto grid-cols-8 gap-2">
        <TableHeaderCell
          value="orderNumber"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Номер
        </TableHeaderCell>
        <TableHeaderCell
          value="date"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Дата
        </TableHeaderCell>
        <TableHeaderCell
          value="createdAt"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Создано
        </TableHeaderCell>
        <TableHeaderCell
          value="type"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Тип
        </TableHeaderCell>
        <TableHeaderCell
          value="salesOrganization"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Организация
        </TableHeaderCell>
        <TableHeaderCell
          value="warehouse"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Склад
        </TableHeaderCell>
        <TableHeaderCell
          value="resource"
          onSort={onSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        >
          Ресурс
        </TableHeaderCell>
        <TableHeaderCell value="actions" className="font-bold" />

        {!isLoading &&
          requests.map((request, index) => (
            <RequestListItem
              ref={index === requests.length - 1 ? ref : null}
              key={request.id}
              item={request}
              user={user}
            />
          ))}
        <li className="col-span-7 flex items-center justify-center gap-x-4 text-sm text-zinc-500">
          {isFetching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Загружаем больше запросов...
            </>
          ) : hasNextPage ? (
            <>
              <ArrowDown className="size-4" />
              Скролл вниз, чтобы загрузить больше запросов
            </>
          ) : (
            <>
              <BookCheck className="size-4" />
              Нет больше запросов
            </>
          )}
        </li>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export default RequestsList

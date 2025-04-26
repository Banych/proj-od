'use client'

import TableHeaderCell from '@/components/table-header-cell'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import UserListItem from '@/components/user-list-item'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants/lists-constants'
import { UserDTO } from '@/types/dtos'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowDown, Loader2, User } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const AdminUsersList = () => {
    const [orderBy, setOrderBy] = useState('createdAt')
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')
    const lastUserRef = useRef<HTMLDivElement | null>(null)
    const { entry } = useIntersection({
        root: lastUserRef.current,
        threshold: 0.5,
    })

    const {
        data: users,
        isFetching: isUsersFetching,
        fetchNextPage,
        hasNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['adminUsers', orderBy, orderDirection],
        queryFn: async ({ pageParam }) => {
            const searchParams = new URLSearchParams()
            searchParams.set('page', pageParam.toString())
            searchParams.set(
                'limit',
                INFINITE_SCROLLING_PAGINATION_RESULTS.toString()
            )
            searchParams.set('orderBy', orderBy)
            searchParams.set('orderDirection', orderDirection)

            const { data } = await axios.get<(UserDTO & { createdAt: Date })[]>(
                `/api/admin/users?${searchParams.toString()}`
            )
            return data
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS
                ? undefined
                : pages.length + 1
        },
        initialPageParam: 1,
    })

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage, hasNextPage])

    const onSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        setOrderBy(sortBy)
        setOrderDirection(sortOrder)
    }, [])

    const onUserUpdate = useCallback(async () => {
        await refetch()
    }, [refetch])

    const usersList = users?.pages.flat() || []

    return (
        <ScrollArea className="grow">
            <div className="grid auto-rows-auto grid-cols-6 gap-4">
                <TableHeaderCell
                    value="username"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Логин
                </TableHeaderCell>
                <TableHeaderCell
                    value="name"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Имя
                </TableHeaderCell>
                <TableHeaderCell
                    value="surname"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Фамилия
                </TableHeaderCell>
                <TableHeaderCell
                    value="email"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Email
                </TableHeaderCell>
                <TableHeaderCell
                    value="role"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Роль
                </TableHeaderCell>
                <TableHeaderCell
                    value="createdAt"
                    onSort={onSort}
                    sortBy={orderBy}
                    sortOrder={orderDirection}
                >
                    Дата создания
                </TableHeaderCell>
                <TableHeaderCell value="actions"></TableHeaderCell>
                {!isLoading &&
                    usersList.map((user, index) => (
                        <UserListItem
                            key={user.id}
                            user={user}
                            ref={
                                index === usersList.length - 1
                                    ? lastUserRef
                                    : null
                            }
                            onUpdate={onUserUpdate}
                        />
                    ))}
                <div className="col-span-7 flex items-center justify-center gap-x-4 text-sm text-zinc-500">
                    {isUsersFetching ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Загружаем больше пользователей...
                        </>
                    ) : hasNextPage ? (
                        <>
                            <ArrowDown className="size-4" />
                            Скролл вниз, чтобы загрузить больше пользователей
                        </>
                    ) : (
                        <>
                            <User className="size-4" />
                            Нет больше пользователей
                        </>
                    )}
                </div>
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default AdminUsersList

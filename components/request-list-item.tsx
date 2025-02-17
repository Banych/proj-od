'use client'

import { Trash, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, Fragment, useCallback, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { getTypeName } from '@/lib/utils'
import { RequestDTO, UserDTO } from '@/types/dtos'

type RequestItemProps = {
    item: RequestDTO
    user: UserDTO
}

const RequestListItem: FC<RequestItemProps> = ({ item, user }) => {
    const { push } = useRouter()

    const isDeleteAllowed = useMemo(() => {
        return user.role === 'Admin' || user.id === item.userId
    }, [item.userId, user.id, user.role])

    const handleDelete = useCallback(() => {
        fetch(`http://localhost:3000/api/requests/${item.id}`, {
            method: 'DELETE',
        })
    }, [item.id])

    const handleOpen = useCallback(() => {
        push(`/requests/${item.id}`)
    }, [item.id, push])

    return (
        <Fragment>
            <div className="flex items-center gap-2">
                {item.id}
                {item.status === 'incorrect' && (
                    <TriangleAlert className="size-6 text-orange-700" />
                )}
            </div>
            <div>{item.date}</div>
            <div>{getTypeName(item.type)}</div>
            <div>{item.salesOrganization}</div>
            <div>{item.warehouse}</div>
            <div>{item.resource}</div>
            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleOpen}>
                    Open
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                    disabled={!isDeleteAllowed}
                >
                    <Trash className="size-6" />
                </Button>
            </div>
        </Fragment>
    )
}

export default RequestListItem

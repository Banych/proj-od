'use client'

import { Trash, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { forwardRef, Fragment, useCallback, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { RequestStatus, Role } from '@/lib/generated/prisma'
import { getSalesOrganizationName, getTypeName } from '@/lib/utils'
import { RequestWithUser, UserDTO } from '@/types/dtos'
import { format } from 'date-fns'

type RequestItemProps = {
    item: RequestWithUser
    user: UserDTO
}

const RequestListItem = forwardRef<HTMLDivElement, RequestItemProps>(
    ({ item, user }, ref) => {
        const { push } = useRouter()

        const isDeleteAllowed = useMemo(() => {
            return user.role === Role.ADMIN || user.id === item.userId
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
                <div className="flex items-center gap-2" ref={ref}>
                    {item.orderNumber}
                    {item.status === RequestStatus.INCORRECT && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TriangleAlert className="size-6 text-orange-700" />
                            </TooltipTrigger>
                            <TooltipContent>Запрос некорректен</TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <div className="flex items-center">
                    {format(item.date, 'dd.MM.yyyy')}
                </div>
                <div className="flex items-center">
                    {getTypeName(item.type)}
                </div>
                <div className="flex items-center">
                    {getSalesOrganizationName(item.salesOrganization)}
                </div>
                <div className="flex items-center">{item.warehouse}</div>
                <div className="flex items-center">{item.resource}</div>
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
)
RequestListItem.displayName = 'RequestListItem'

export default RequestListItem

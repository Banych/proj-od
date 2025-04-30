'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Trash, TriangleAlert } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import { forwardRef, Fragment, useCallback, useMemo } from 'react'

import FormattedDate from '@/components/formatted-date'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RequestStatus, Role } from '@/generated/prisma-client'
import { useToast } from '@/hooks/use-toast'
import { getSalesOrganizationName, getTypeName } from '@/lib/utils'
import { RequestWithUser, UserDTO } from '@/types/dtos'
import Link from 'next/link'

type RequestItemProps = {
  item: RequestWithUser
  user: UserDTO
}

const RequestListItem = forwardRef<HTMLDivElement, RequestItemProps>(
  ({ item, user }, ref) => {
    const { refresh } = useRouter()
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const isDeleteAllowed = useMemo(() => {
      return user.role === Role.ADMIN || user.id === item.userId
    }, [item.userId, user.id, user.role])

    const { mutate: deleteRequest, isPending: isDeleteRequestPending } =
      useMutation({
        mutationKey: ['delete-request', item.id],
        mutationFn: async () => {
          return axios.delete(`/api/requests/${item.id}`)
        },
        onSuccess: () => {
          refresh()
          queryClient.invalidateQueries({ queryKey: ['requests'] })
          toast({
            title: 'Успех',
            description: 'Запрос удален',
            variant: 'default',
          })
        },
        onError: () => {
          toast({
            title: 'Ошибка',
            description: 'Не удалось удалить запрос',
            variant: 'destructive',
          })
        },
      })

    const handleDelete = useCallback(() => {
      deleteRequest()
    }, [deleteRequest])

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
          <FormattedDate date={item.date} formatString="dd.MM.yyyy" />
        </div>
        <div className="flex items-center">{getTypeName(item.type)}</div>
        <div className="flex items-center">
          {getSalesOrganizationName(item.salesOrganization)}
        </div>
        <div className="flex items-center">{item.warehouse}</div>
        <div className="flex items-center">{item.resource}</div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: 'secondary' })}
            href={`/requests/${item.orderNumber}`}
          >
            Открыть
          </Link>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={!isDeleteAllowed}
            loading={isDeleteRequestPending}
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

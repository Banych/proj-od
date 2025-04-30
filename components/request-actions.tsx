'use client'

import axios from 'axios'
import { Pencil, SquareCheckBig } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { FC } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Request, RequestStatus, Role } from '@/generated/prisma-client'
import { UserDTO } from '@/types/dtos'
import { useMutation } from '@tanstack/react-query'

type RequestActionsProps = {
  item: Request
  user: UserDTO
}

const RequestActions: FC<RequestActionsProps> = ({ item, user }) => {
  const { refresh } = useRouter()

  const isEditVisible =
    user.role === Role.ADMIN ||
    user.role === Role.DISPATCHER ||
    user.id === item.userId

  const isCompleteVisible = item.status !== RequestStatus.COMPLETED

  const { mutate: completeRequest, isPending: isCompeteRequestPending } =
    useMutation({
      mutationKey: ['complete-request'],
      mutationFn: async () => {
        return axios.get(`/api/requests/${item.id}/complete`)
      },
      onSuccess: () => {
        refresh()
      },
    })

  return (
    <div className="flex items-center gap-2">
      {isEditVisible && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/requests/${item.id}/edit`}
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              aria-label="Редактировать"
            >
              <Pencil className="size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Редактировать</TooltipContent>
        </Tooltip>
      )}

      {isCompleteVisible && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="cursor-pointer"
              loading={isCompeteRequestPending}
              onClick={() => completeRequest()}
              aria-label="Завершить"
            >
              <SquareCheckBig className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Завершить</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export default RequestActions

'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { FC } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
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
                <Link
                    href={`/requests/${item.id}/edit`}
                    className={buttonVariants({ variant: 'outline' })}
                >
                    Редактировать
                </Link>
            )}

            {isCompleteVisible && (
                <Button
                    variant="destructive"
                    loading={isCompeteRequestPending}
                    onClick={() => completeRequest()}
                >
                    Завершить
                </Button>
            )}
        </div>
    )
}

export default RequestActions

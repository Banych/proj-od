'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { RequestDTO, UserDTO } from '@/types/dtos'

type RequestActionsProps = {
    item: RequestDTO
    user: UserDTO
}

const RequestActions: FC<RequestActionsProps> = ({ item, user }) => {
    const { refresh } = useRouter()

    const isEditVisible =
        user.role === 'Admin' ||
        user.role === 'Dispatcher' ||
        user.id === item.userId

    const isCompleteVisible = item.status !== 'completed'

    const handleComplete = async () => {
        await fetch(`/api/requests/${item.id}/complete`, {
            method: 'GET',
        })

        refresh()
    }

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
                <Button variant="destructive" onClick={handleComplete}>
                    Завершить
                </Button>
            )}
        </div>
    )
}

export default RequestActions

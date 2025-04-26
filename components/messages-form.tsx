'use client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { Textarea } from '@/components/ui/textarea'
import { Role } from '@/generated/prisma-client'
import { useToast } from '@/hooks/use-toast'
import { UserDTO } from '@/types/dtos'

type MessagesFormProps = {
    requestId: string
    user: UserDTO
}

const MessagesForm: FC<MessagesFormProps> = ({ requestId, user }) => {
    const [message, setMessage] = useState('')
    const [needCorrection, setNeedCorrection] = useState(false)

    const { data } = useSession()
    const { toast } = useToast()
    const { refresh } = useRouter()

    const isNeedCorrectionVisible = useMemo(
        () => user.role === Role.DISPATCHER || user.role === Role.ADMIN,
        [user.role]
    )

    const { mutate: postMessage, isPending: isPostMessagePending } =
        useMutation({
            mutationKey: ['send-message', requestId, user.id],
            mutationFn: async () => {
                return axios.post('/api/messages', {
                    message,
                    requestId,
                    userId: data?.user?.id,
                    needCorrection,
                })
            },
            onSuccess: () => {
                refresh()
                setMessage('')
                setNeedCorrection(false)
                toast({
                    title: 'Успех',
                    description: 'Сообщение отправлено',
                    variant: 'default',
                })
            },
            onError: () => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось отправить сообщение',
                    variant: 'destructive',
                })
            },
        })

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!message) {
                toast({
                    title: 'Ошибка',
                    description: 'Введите сообщение',
                    variant: 'destructive',
                })
                return
            }

            if (!data?.user?.id) {
                toast({
                    title: 'Ошибка',
                    description: 'Вы не авторизованы',
                    variant: 'destructive',
                })
                return
            }

            postMessage()
        },
        [data?.user?.id, message, postMessage, toast]
    )

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение"
                className="max-h-36"
                disabled={isPostMessagePending}
            />
            <div className="flex items-center gap-4">
                {isNeedCorrectionVisible && (
                    <InputWithLabel
                        label="Требуется исправление"
                        type="checkbox"
                        orientation="horizontal"
                        checked={needCorrection}
                        disabled={isPostMessagePending}
                        onChange={() => setNeedCorrection(!needCorrection)}
                    />
                )}
                <Button
                    type="submit"
                    size="sm"
                    className="grow"
                    loading={isPostMessagePending}
                >
                    Отправить
                </Button>
            </div>
        </form>
    )
}

export default MessagesForm

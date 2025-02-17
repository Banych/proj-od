'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { Textarea } from '@/components/ui/textarea'
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
        () => user.role === 'Dispatcher' || user.role === 'Admin',
        [user.role]
    )

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

            const result = await fetch('http://localhost:3000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    requestId,
                    userId: data?.user?.id,
                    needCorrection,
                }),
            })

            if (result.ok) {
                refresh()
                setMessage('')
                setNeedCorrection(false)
                toast({
                    title: 'Успех',
                    description: 'Сообщение отправлено',
                    variant: 'default',
                })
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось отправить сообщение',
                    variant: 'destructive',
                })
            }
        },
        [data?.user?.id, message, needCorrection, refresh, requestId, toast]
    )

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение"
                className="max-h-36"
            />
            <div className="flex items-center gap-4">
                {isNeedCorrectionVisible && (
                    <InputWithLabel
                        label="Требуется исправление"
                        type="checkbox"
                        orientation="horizontal"
                        checked={needCorrection}
                        onChange={() => setNeedCorrection(!needCorrection)}
                    />
                )}
                <Button type="submit" size="sm" className="grow">
                    Отправить
                </Button>
            </div>
        </form>
    )
}

export default MessagesForm

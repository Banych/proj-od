'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

type MessagesFormProps = {
    requestId: string
}

const MessagesForm: FC<MessagesFormProps> = ({ requestId }) => {
    const [message, setMessage] = useState('')

    const { data } = useSession()
    const { toast } = useToast()
    const { refresh } = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            }),
        })

        if (result.ok) {
            refresh()
            setMessage('')
        } else {
            toast({
                title: 'Ошибка',
                description: 'Не удалось отправить сообщение',
                variant: 'destructive',
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение"
                className="max-h-36"
            />
            <Button type="submit" size="sm">
                Отправить
            </Button>
        </form>
    )
}

export default MessagesForm

import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'

import MessagesForm from '@/components/messages-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import getSessionUser from '@/lib/get-session-user'
import { MessageWithUser } from '@/types/dtos'

type MessagesProps = {
    messages: MessageWithUser[]
    requestId: string
}

const Messages: FC<MessagesProps> = async ({ messages, requestId }) => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">Сообщения</h3>
            <MessagesForm requestId={requestId} user={dbUser} />
            <div className="flex flex-col gap-4">
                {messages.map((message: MessageWithUser) => (
                    <Card key={message.id} className="flex flex-col gap-2">
                        <CardHeader className="flex flex-row items-center gap-4 px-3 py-1 text-xl font-semibold">
                            <Button
                                variant="link"
                                asChild
                                size="lg"
                                className="text-xl"
                            >
                                <Link href={`/users/${message.user.username}`}>
                                    @
                                    {message.user.name && message.user.surname
                                        ? `${message.user.name} ${message.user.surname}`
                                        : message.user.username}
                                </Link>
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {format(message.createdAt, 'dd.MM.yyyy HH:mm')}
                            </span>
                        </CardHeader>
                        <CardContent className="px-4 text-lg">
                            {message.message}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Messages

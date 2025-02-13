import MessagesForm from '@/components/messages-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MessageWithUserDTO } from '@/types/dtos'
import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'

type MessagesProps = {
    messages: MessageWithUserDTO[]
    requestId: string
}

const Messages: FC<MessagesProps> = ({ messages, requestId }) => {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">Сообщения</h3>
            <MessagesForm requestId={requestId} />
            <div className="flex flex-col gap-4">
                {messages.map((message: MessageWithUserDTO) => (
                    <Card key={message.id} className="flex flex-col gap-2">
                        <CardHeader className="flex flex-row items-center gap-4 px-3 py-1 text-xl font-semibold">
                            <Button
                                variant="link"
                                asChild
                                size="lg"
                                className="text-xl"
                            >
                                <Link href={`/users/${message.user.id}`}>
                                    @{message.user.username}
                                </Link>
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {format(
                                    new Date(message.date),
                                    'dd.MM.yyyy HH:mm'
                                )}
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

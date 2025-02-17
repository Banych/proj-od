import {
    CreateMessageDTO,
    MessageDTO,
    MessageWithUserDTO,
    UserDTO,
} from '@/types/dtos'

export default {
    getMessages: async (params: Record<string, string>) => {
        const query = new URLSearchParams(params).toString()
        const response = await fetch(
            `http://localhost:8000/messages?${query}`,
            {
                method: 'GET',
            }
        )

        return response.json()
    },
    getMessagesWithUser: async (
        params: Record<string, string>
    ): Promise<MessageWithUserDTO[]> => {
        const query = new URLSearchParams(params).toString()
        const response = await fetch(
            `http://localhost:8000/messages?${query}`,
            {
                method: 'GET',
                cache: 'no-cache',
            }
        )

        const messages: MessageDTO[] = await response.json()

        const usersIds = messages
            .map((message: MessageDTO) => `id=${message.userId}`)
            .join('&')

        const usersResponse = await fetch(
            `http://localhost:8000/users?${usersIds}`,
            {
                method: 'GET',
            }
        )

        const users: UserDTO[] = await usersResponse.json()

        return messages.map((message: MessageDTO) => {
            const user = users.find(
                (user: UserDTO) => user.id === message.userId
            )!

            return {
                ...message,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                },
            }
        })
    },
    createMessage: async (data: CreateMessageDTO) => {
        const response = await fetch('http://localhost:8000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    },
}

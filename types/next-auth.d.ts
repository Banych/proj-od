import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            name: string
            id: string
        }
    }
}

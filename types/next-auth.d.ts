import { DefaultSession, DefaultUser as NextDefaultUser } from 'next-auth'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            name: string
            username: string
            email: string
            id: string
            image?: string
        }
    }

    interface DefaultUser extends NextDefaultUser {
        username: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        username?: string | null
    }
}

import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth-options'
import usersClient from '@/lib/db-clients/users.client'

export default async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    const dbUser = await usersClient.getUser(session.user.id)

    if (!dbUser) {
        return null
    }

    return dbUser
}

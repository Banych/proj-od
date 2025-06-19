import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { UserDTO } from '@/types/dtos'

const getSessionUser = async (): Promise<UserDTO | null> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      role: true,
      name: true,
      surname: true,
      email: true,
      rfRu: true,
    },
  })

  if (!dbUser) {
    return null
  }

  return dbUser
}

export default getSessionUser

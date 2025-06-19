import ProfileForm from '@/components/profile-form'
import getSessionUser from '@/lib/get-session-user'
import { notFound } from 'next/navigation'
import { db } from '../../lib/db'

const ProfilePage = async () => {
  const dbUser = await getSessionUser()

  if (!dbUser) {
    return notFound()
  }

  const user = await db.user.findUnique({
    where: {
      id: dbUser.id,
    },
    select: {
      id: true,
      username: true,
      role: true,
      name: true,
      surname: true,
      email: true,
      rfRu: true, // Assuming rfRu is a field in the user model
    },
  })

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Профиль</h2>
      <ProfileForm user={user} />
    </div>
  )
}

export default ProfilePage

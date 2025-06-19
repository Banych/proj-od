import ProfileForm from '@/components/profile-form'
import getSessionUser from '@/lib/get-session-user'
import { notFound } from 'next/navigation'

const ProfilePage = async () => {
  const dbUser = await getSessionUser()

  if (!dbUser) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Профиль</h2>
      <ProfileForm user={dbUser} />
    </div>
  )
}

export default ProfilePage

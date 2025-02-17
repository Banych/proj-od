import ProfileForm from '@/components/profile-form'
import getSessionUser from '@/lib/get-session-user'

const ProfilePage = async () => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Профиль</h2>
            <ProfileForm user={dbUser} />
        </div>
    )
}

export default ProfilePage

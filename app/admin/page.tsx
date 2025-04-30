import AdminUsersList from '@/components/admin-users-list'
import { Role } from '@/generated/prisma-client'
import getSessionUser from '@/lib/get-session-user'
import { notFound } from 'next/navigation'

const AdminPage = async () => {
  const user = await getSessionUser()

  if (!user || user.role !== Role.ADMIN) {
    notFound()
  }

  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="text-3xl font-bold">Admin Page</h1>
      <AdminUsersList />
    </div>
  )
}

export default AdminPage

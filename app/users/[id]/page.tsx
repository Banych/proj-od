import { FC } from 'react'

import { Label } from '@/components/ui/label'
import usersClient from '@/lib/db-clients/users.client'

type UserDetailsPageProps = {
    params: Promise<{ id: string }>
}

const UserDetailsPage: FC<UserDetailsPageProps> = async ({ params }) => {
    const { id } = await params

    const user = await usersClient.getUser(id)

    return (
        <div className="grid auto-rows-min grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <Label>Имя</Label>
                <span>{user.name}</span>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Фамилия</Label>
                <span>{user.surname}</span>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Почта</Label>
                <span>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Роль</Label>
                <span>{user.role}</span>
            </div>
        </div>
    )
}

export default UserDetailsPage

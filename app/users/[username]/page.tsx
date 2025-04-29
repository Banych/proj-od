import { notFound } from 'next/navigation'
import { FC } from 'react'

import { Label } from '@/components/ui/label'
import { db } from '@/lib/db'
import { getRoleName } from '@/lib/utils'

type UserDetailsPageProps = {
    params: Promise<{ username: string }>
}

const UserDetailsPage: FC<UserDetailsPageProps> = async ({ params }) => {
    const { username } = await params

    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
            username: true,
            role: true,
            name: true,
            surname: true,
            email: true,
        },
    })

    if (!user) {
        notFound()
    }

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
                <span>{getRoleName(user.role)}</span>
            </div>
        </div>
    )
}

export default UserDetailsPage

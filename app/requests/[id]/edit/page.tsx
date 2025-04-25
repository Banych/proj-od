import { FC } from 'react'

import RequestForm from '@/components/request-form'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { CreateRequestDTO, RequestWithUser } from '@/types/dtos'

type EditRequestPageProps = {
    params: Promise<{ id: string }>
}

const EditRequestPage: FC<EditRequestPageProps> = async ({ params }) => {
    const { id } = await params

    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const requestItem = (await db.request.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                    name: true,
                    surname: true,
                    email: true,
                },
            },
        },
    })) as RequestWithUser

    const handleEdit = async (values: CreateRequestDTO) => {
        'use server'

        await db.message.create({
            data: {
                message: 'Запрос обновлен',
                requestId: id,
                userId: dbUser.id,
            },
        })

        return db.request.update({
            where: {
                id,
            },
            data: {
                ...values,
            },
        })
    }

    return (
        <RequestForm
            initialValues={requestItem}
            onFormSubmit={handleEdit}
            submitButtonText="Сохранить"
        />
    )
}

export default EditRequestPage

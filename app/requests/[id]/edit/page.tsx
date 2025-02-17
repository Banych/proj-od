import { FC } from 'react'

import RequestForm from '@/components/request-form'
import messagesClient from '@/lib/db-clients/messages.client'
import requestsClient from '@/lib/db-clients/requests.client'
import getSessionUser from '@/lib/get-session-user'
import { CreateRequestDTO } from '@/types/dtos'

type EditRequestPageProps = {
    params: Promise<{ id: string }>
}

const EditRequestPage: FC<EditRequestPageProps> = async ({ params }) => {
    const { id } = await params

    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const requestItem = await requestsClient.getRequest(id)

    const handleEdit = async (values: CreateRequestDTO) => {
        'use server'

        await messagesClient.createMessage({
            date: new Date().toISOString(),
            message: 'Запрос обновлен',
            requestId: id,
            userId: dbUser.id,
        })

        return requestsClient.updateRequest(id, values)
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

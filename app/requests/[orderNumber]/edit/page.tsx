import { FC } from 'react'

import RequestForm from '@/components/request-form'
import { db } from '@/lib/db'
import getSessionUser from '@/lib/get-session-user'
import { CreateRequestDTO, RequestWithUser } from '@/types/dtos'
import { notFound } from 'next/navigation'

type EditRequestPageProps = {
  params: Promise<{ orderNumber: string }>
}

const EditRequestPage: FC<EditRequestPageProps> = async ({ params }) => {
  const { orderNumber } = await params

  const dbUser = await getSessionUser()

  if (!dbUser) {
    return null
  }

  const orderNumberInt = parseInt(orderNumber, 10)
  if (isNaN(orderNumberInt) || orderNumberInt <= 0) {
    return notFound()
  }

  const requestItem = (await db.request.findUnique({
    where: {
      orderNumber: orderNumberInt,
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
        requestId: requestItem.id,
        userId: dbUser.id,
      },
    })

    return db.request.update({
      where: {
        id: requestItem.id,
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

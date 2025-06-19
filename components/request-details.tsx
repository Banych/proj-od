import { TriangleAlert } from 'lucide-react'
import { FC } from 'react'

import FormattedDate from '@/components/formatted-date'
import Messages from '@/components/messages'
import RequestActions from '@/components/request-actions'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RequestStatus } from '@/generated/prisma-client'
import { getSalesOrganizationName, getTypeName } from '@/lib/utils'
import { MessageWithUser, RequestWithUser, UserDTO } from '@/types/dtos'

type RequestDetailsProps = {
  item: RequestWithUser
  user: UserDTO
  messages?: MessageWithUser[]
}

const RequestDetails: FC<RequestDetailsProps> = ({ item, messages, user }) => {
  const formattedType = getTypeName(item.type)

  const formattedSalesOrganization = getSalesOrganizationName(
    item.salesOrganization
  )

  // eslint-disable-next-line no-console
  console.log('odNumber:', item.odNumber)

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-4 text-2xl font-bold">
          Запрос №{item.orderNumber}
          {item.status === RequestStatus.INCORRECT && (
            <Tooltip>
              <TooltipTrigger asChild>
                <TriangleAlert className="size-6 text-orange-700" />
              </TooltipTrigger>
              <TooltipContent className="text-base font-normal">
                Запрос некорректен
              </TooltipContent>
            </Tooltip>
          )}
        </h3>
        <RequestActions item={item} user={user} />
      </div>

      <div className="grid auto-rows-auto grid-cols-4 gap-2">
        <div className="flex flex-col gap-2">
          <div className="font-bold">Тип запроса:</div>
          <div>{formattedType}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold">Организация:</div>
          <div>
            {formattedSalesOrganization
              ? formattedSalesOrganization
              : 'Не указана'}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold">Склад:</div>
          <div>{item.warehouse}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold">Дата:</div>
          <div>
            <FormattedDate date={item.date} formatString="dd.MM.yyyy" />
          </div>
        </div>
      </div>

      {item.odNumber && item.odNumber.trim() && (
        <div className="flex flex-col gap-2">
          <div className="font-bold">OD:</div>
          <div className="flex flex-wrap gap-2">
            {item.odNumber
              .split('|')
              .filter((od) => od.trim() !== '')
              .map((od, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded text-sm font-mono"
                >
                  {od}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pb-4">
        <div className="font-bold">Комментарий:</div>
        <div>{item.comment}</div>
      </div>

      <Messages messages={messages || []} requestId={item.id} />
    </div>
  )
}

export default RequestDetails

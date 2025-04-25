import { Message, Request, User } from '@/lib/generated/prisma'

export type RequestWithUser = Request & {
    user: UserDTO
}

export type RequestDTOStatus = 'created' | 'completed' | 'incorrect'

export type CreateRequestDTO = Omit<
    Request,
    'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'orderNumber'
>

export type RequestTypeDTO =
    | 'OneDayDelivery'
    | 'CorrectionSale'
    | 'CorrectionReturn'
    | 'Sampling'

export type SalesOrganizationTypeDTO =
    | '3801'
    | '3802'
    | '3803'
    | '3804'
    | '3805'
    | '3806'

export type CreateMessageDTO = Omit<
    Message,
    'id' | 'createdAt' | 'updatedAt'
> & {
    needCorrection?: boolean
}

export type MessageWithUser = Message & {
    user: UserDTO
}

export type UserDTO = Omit<User, 'password' | 'createdAt' | 'updatedAt'>

export type RoleDTO = 'Dispatcher' | 'Manager' | 'Admin'

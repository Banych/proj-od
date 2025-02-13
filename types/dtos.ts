export type RequestDTO = {
    type: RequestTypeDTO
    salesOrganization: SalesOrganizationTypeDTO
    warehouse: string
    date: string
    comment: string
    resource: string
    id: string
}

export type CreateRequestDTO = Omit<RequestDTO, 'id'>

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

export type MessageDTO = {
    id: string
    message: string
    requestId: string
    userId: string
    date: string
}

export type CreateMessageDTO = Omit<MessageDTO, 'id'>

export type MessageWithUserDTO = MessageDTO & {
    user: Omit<UserDTO, 'role'>
}

export type UserDTO = {
    id: string
    username: string
    role: RoleDTO
}

export type RoleDTO = 'Dispatcher' | 'Manager' | 'Admin'

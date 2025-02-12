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
    message: string
    requestId: string
    userId: string
}

export type UserDTO = {
    id: string
    name: string
    role: RoleDTO
}

export type RoleDTO = 'Dispatcher' | 'Manager' | 'Admin'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import defaultRequestTypes from '@/constants/default-request-types'
import defaultSalesOrganizationTypes from '@/constants/default-sales-organizations'
import { RequestType, SalesOrganizationType } from '@/lib/generated/prisma'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getTypeName(typeValue: RequestType) {
    return defaultRequestTypes.find((type) => type.value === typeValue)?.text
}

export function getSalesOrganizationName(value: SalesOrganizationType) {
    return defaultSalesOrganizationTypes.find((type) => type.value === value)
        ?.text
}

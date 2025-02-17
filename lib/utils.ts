import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import defaultRequestTypes from '@/constants/default-request-types'
import { RequestTypeDTO } from '@/types/dtos'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getTypeName(typeValue: RequestTypeDTO) {
    return defaultRequestTypes.find((type) => type.value === typeValue)?.text
}

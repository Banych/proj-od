import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import defaultRequestTypes from '@/constants/default-request-types'
import defaultSalesOrganizationTypes from '@/constants/default-sales-organizations'
import {
  RequestType,
  Role,
  SalesOrganizationType,
} from '@/generated/prisma-client'
import { defaultRoles } from '@/constants/default-roles'

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

export function getRoleName(value: Role) {
  return defaultRoles.find((role) => role.value === value)?.text
}

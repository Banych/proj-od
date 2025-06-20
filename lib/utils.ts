import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import defaultPriorities from '@/constants/default-priorities'
import defaultRequestTypes from '@/constants/default-request-types'
import { defaultRoles } from '@/constants/default-roles'
import defaultSalesOrganizationTypes from '@/constants/default-sales-organizations'
import {
  RequestPriority,
  RequestType,
  Role,
  SalesOrganizationType,
} from '@/generated/prisma-client'

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

export function getPriorityName(value: RequestPriority) {
  return defaultPriorities.find((priority) => priority.value === value)?.text
}

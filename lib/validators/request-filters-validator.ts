import { RequestType, SalesOrganizationType } from '@/generated/prisma-client'
import { z } from 'zod'

/*
type RequestFilters = {
  orderNumber: string
  dateFrom: Date
  dateTo: Date
  type: RequestType
  salesOrganization: SalesOrganizationType
  warehouse: string
}
  */

export const requestFiltersValidator = z.object({
  orderNumber: z.string().nullable().optional(),
  dateFrom: z.date().nullable().optional(),
  dateTo: z.date().nullable().optional(),
  type: z
    .enum([
      RequestType.CORRECTION_RETURN,
      RequestType.CORRECTION_SALE,
      RequestType.ONE_DAY_DELIVERY,
      RequestType.SAMPLING,
    ])
    .nullable()
    .optional(),
  salesOrganization: z
    .enum([
      SalesOrganizationType.SALES_3801,
      SalesOrganizationType.SALES_3802,
      SalesOrganizationType.SALES_3803,
      SalesOrganizationType.SALES_3804,
      SalesOrganizationType.SALES_3805,
      SalesOrganizationType.SALES_3806,
    ])
    .nullable()
    .optional(),
  warehouse: z.string().nullable().optional(),
})

export type RequestFiltersType = z.infer<typeof requestFiltersValidator>

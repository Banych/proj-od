'use client'

import { createContext, FC, PropsWithChildren, useState } from 'react'

import {
  RequestPriority,
  RequestType,
  SalesOrganizationType,
} from '@/generated/prisma-client'

export type RequestFilters = {
  orderNumber: string | null
  dateFrom: Date | null
  dateTo: Date | null
  createdAtFrom: Date | null
  createdAtTo: Date | null
  type: RequestType | null
  salesOrganization: SalesOrganizationType | null
  priority: RequestPriority | null
  warehouse: string | null
  rfRu: string | null
}

export type FiltersContextType = {
  filters: RequestFilters
  setFilters: (filters: Partial<RequestFilters>) => void
  resetFilters: () => void
}

export const FiltersContext = createContext<FiltersContextType>({
  filters: {
    orderNumber: null,
    dateFrom: null,
    dateTo: null,
    createdAtFrom: null,
    createdAtTo: null,
    type: null,
    salesOrganization: null,
    priority: null,
    warehouse: null,
    rfRu: null,
  },
  setFilters: () => {},
  resetFilters: () => {},
})

const FiltersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<RequestFilters>({
    orderNumber: null,
    dateFrom: null,
    dateTo: null,
    createdAtFrom: null,
    createdAtTo: null,
    type: null,
    salesOrganization: null,
    priority: null,
    warehouse: null,
    rfRu: null,
  })

  const setFiltersHandler = (newFilters: Partial<RequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFiltersHandler = () => {
    setFilters({
      orderNumber: null,
      dateFrom: null,
      dateTo: null,
      createdAtFrom: null,
      createdAtTo: null,
      type: null,
      salesOrganization: null,
      priority: null,
      warehouse: null,
      rfRu: null,
    })
  }

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters: setFiltersHandler,
        resetFilters: resetFiltersHandler,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}
export default FiltersProvider

'use client'

import { createContext, FC, PropsWithChildren, useState } from 'react'

import { RequestType, SalesOrganizationType } from '@/generated/prisma-client'

export type RequestFilters = {
    orderNumber: string
    dateFrom: Date
    dateTo: Date
    type: RequestType
    salesOrganization: SalesOrganizationType
    warehouse: string
}

export type FiltersContextType = {
    filters: Partial<RequestFilters>
    setFilters: (filters: Partial<RequestFilters>) => void
    resetFilters: () => void
}

export const FiltersContext = createContext<FiltersContextType>({
    filters: {},
    setFilters: () => {},
    resetFilters: () => {},
})

const FiltersProvider: FC<PropsWithChildren> = ({ children }) => {
    const [filters, setFilters] = useState<Partial<RequestFilters>>({})

    const setFiltersHandler = (newFilters: Partial<RequestFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }))
    }

    const resetFiltersHandler = () => {
        setFilters({})
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

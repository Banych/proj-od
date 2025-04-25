import { useContext } from 'react'

import { FiltersContext } from '@/components/providers/filters-provider'

export default () => {
    const context = useContext(FiltersContext)

    if (!context) {
        throw new Error('useFilters must be used within a FiltersProvider')
    }

    return context
}

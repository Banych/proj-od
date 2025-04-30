import { useContext } from 'react'

import { FiltersContext } from '@/components/providers/filters-provider'

const useRequestFilters = () => {
  const context = useContext(FiltersContext)

  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }

  return context
}

export default useRequestFilters

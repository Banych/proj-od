import { useContext } from 'react'

import { TimezoneContext } from '@/components/providers/timezone-provider'

const useTimezone = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider')
  }

  return context
}

export default useTimezone

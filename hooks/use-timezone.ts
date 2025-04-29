import { useContext } from 'react'

import { TimezoneContext } from '@/components/providers/timezone-provider'

export default () => {
    const context = useContext(TimezoneContext)

    if (!context) {
        throw new Error('useTimezone must be used within a TimezoneProvider')
    }

    return context
}

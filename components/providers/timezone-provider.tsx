'use client'

import { createContext, FC, PropsWithChildren } from 'react'

export type TimezoneContext = {
  timezone: string
}

export const TimezoneContext = createContext<TimezoneContext>({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

export const TimezoneProvider: FC<PropsWithChildren> = ({ children }) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <TimezoneContext.Provider value={{ timezone }}>
      {children}
    </TimezoneContext.Provider>
  )
}

export default TimezoneProvider

'use client'

import FiltersProvider from '@/components/providers/filters-provider'
import SessionProvider from '@/components/providers/session-provider'
import TimezoneProvider from '@/components/providers/timezone-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient()

  return (
    <SessionProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <TimezoneProvider>
            <FiltersProvider>{children}</FiltersProvider>
          </TimezoneProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </SessionProvider>
  )
}

export default Providers

'use client'

import SessionProvider from '@/components/providers/session-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'

const Providers: FC<PropsWithChildren> = ({ children }) => {
    const queryClient = new QueryClient()

    return (
        <SessionProvider>
            <TooltipProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </TooltipProvider>
        </SessionProvider>
    )
}

export default Providers

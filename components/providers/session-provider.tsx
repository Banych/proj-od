'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { FC, PropsWithChildren } from 'react'

const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}

export default SessionProvider

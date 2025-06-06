import type { Metadata } from 'next'
import localFont from 'next/font/local'
import NextTopLoader from 'nextjs-toploader'

import Header from '@/components/header'
import Providers from '@/components/providers/providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Мултон Партнерз',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false} />
        <Providers>
          <div className="container m-auto flex h-screen flex-col gap-2 p-4">
            <Header />
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

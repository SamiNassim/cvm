import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ProviderSession } from '@/components/providers/session-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { NextUIProviders } from '@/components/providers/nextui-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CVM',
  description: 'Site de rencontre',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <ProviderSession>
            <SocketProvider>
              <QueryProvider>
                <NextUIProviders>
                  <main className='flex flex-col justify-center items-center'>
                    <Navbar />
                    {children}
                  </main>
                </NextUIProviders>
                <Toaster />
              </QueryProvider>
            </SocketProvider>
          </ProviderSession>
        </ThemeProvider>
      </body>
    </html>
  )
}

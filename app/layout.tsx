import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CVM',
  description: 'Site de rencontre',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <main className='h-screen flex flex-col justify-center items-center'>
          <Navbar />
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

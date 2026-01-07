import type { Metadata } from 'next'
import { Lato, Comfortaa } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-family',
})

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--second-family',
})

export const metadata: Metadata = {
  title: 'Pregnancy App',
  description: 'Pregnancy helper application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${lato.variable} ${comfortaa.variable}`}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}

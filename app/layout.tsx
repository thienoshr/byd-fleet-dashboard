import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import 'leaflet/dist/leaflet.css'
import '../styles/globals.css'
import Navigation from '@/components/Navigation'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fleet Dashboard',
  description: 'Dashboard for managing fleet risk, vehicles, and agreements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans`}>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}




import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Toyota Matchmaker',
  description: 'Utilize AI to find your dream Toyota!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

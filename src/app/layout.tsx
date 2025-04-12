import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Lane',
  description: 'Your personal memory journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 
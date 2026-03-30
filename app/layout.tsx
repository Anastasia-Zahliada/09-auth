import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'
import './globals.css'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'NoteHub is an application for creating, browsing, and managing personal notes.',
  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub is an application for creating, browsing, and managing personal notes.',
    url: '/',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  )
}

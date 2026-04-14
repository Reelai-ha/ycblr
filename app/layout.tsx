import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import NavBar from './components/NavBar'
import TwitterCTA from './components/TwitterCTA'
import Ticker from './components/Ticker'

export const metadata: Metadata = {
  title: 'YC BLR \'26 — Founder Directory',
  description: 'Networking directory for YC Startup School Bangalore, April 18, 2026',
  manifest: '/manifest.json',
  openGraph: {
    title: "YC BLR '26 — Founder Directory",
    description: "Meet 200+ founders at YC Startup School Bangalore. Browse products, find co-founders, and track connections.",
    url: 'https://ycblr.xyz',
    siteName: 'YC BLR Directory',
    images: [{ url: 'https://ycblr.xyz/og-image.png' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "YC BLR '26 — Founder Directory",
    description: "Meet 200+ founders at YC Startup School Bangalore.",
    creator: '@kiaan_mittal',
    images: ['https://ycblr.xyz/og-image.png'],
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'YC BLR \'26' },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col bg-white text-zinc-900">
          <Ticker />
          <NavBar />
          <main className="flex-1">{children}</main>
          <TwitterCTA />
          <footer className="border-t border-zinc-100 py-6 text-center text-sm text-zinc-400">
            Open Source · Built for YC Startup School Bangalore ·{' '}
            <a href="https://twitter.com/kiaan_mittal" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 transition-colors">
              @kiaan_mittal
            </a>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}

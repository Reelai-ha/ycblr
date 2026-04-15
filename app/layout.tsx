import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import NavBar from './components/NavBar'
import TwitterCTA from './components/TwitterCTA'
import DataFastInit from './components/DataFastInit'

export const metadata = {
  title: "YC BLR Directory",
  description: "Live founder directory for YC Bangalore",
  openGraph: {
    title: "YC BLR Directory",
    description: "50+ founders already inside. Don't show up blind.",
    url: "https://ycblr.xyz",
    siteName: "YC BLR",
    images: [
      {
        url: "https://ycblr.xyz/og.png", // IMPORTANT
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YC BLR Directory",
    description: "50+ founders already inside.",
    images: ["https://ycblr.xyz/og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta property="og:image" content="https://ycblr.xyz/og.png" />
          <meta name="twitter:image" content="https://ycblr.xyz/og.png" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className="min-h-screen flex flex-col bg-white text-zinc-900">
          <Analytics />
          <DataFastInit />
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

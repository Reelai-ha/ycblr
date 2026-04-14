'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const { isSignedIn } = useUser()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (scrolled) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <nav className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg shadow-black/5 px-2 py-2">
          <Link href="/" className="flex items-center gap-2 px-3 py-1">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-md" />
            <span className="font-black text-zinc-900 text-sm">YC BLR</span>
          </Link>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
          <div className="flex items-center text-sm">
            <Link href="/founders" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Founders</Link>
            <Link href="/showcase" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Showcase</Link>
            <Link href="/map" className="hidden sm:block px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Map</Link>
            <Link href="/networking-board" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Board</Link>
            <Link href="/setup" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Setup</Link>
          </div>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
          <div className="flex items-center gap-1 pr-1">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in" className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 rounded-full transition-colors">Sign in</Link>
                <Link href="/sign-up" className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-400 text-white rounded-full transition-colors font-medium">Join</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    )
  }

  return (
    <nav className="border-b border-zinc-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-black text-lg flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-zinc-900">YC BLR &apos;26</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/founders" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Founders</Link>
            <Link href="/showcase" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Showcase</Link>
            <Link href="/map" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Map</Link>
            <Link href="/networking-board" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Board</Link>
            <Link href="/setup" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Setup</Link>
          </div>
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link href="/card" className="text-sm text-orange-500 hover:text-orange-400 hidden sm:block px-3 py-1.5 font-semibold transition-colors">My Card</Link>
                <Link href="/connections" className="text-sm text-zinc-500 hover:text-zinc-900 hidden sm:block px-3 py-1.5 hover:bg-zinc-100 rounded-lg transition-colors">Connections</Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5">Sign in</Link>
                <Link href="/sign-up" className="text-sm bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">Join</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

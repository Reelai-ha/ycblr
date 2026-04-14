'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function NavBar() {
  const { isSignedIn } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      {/* Main navbar */}
      <nav className="border-b border-zinc-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded">YC</span>
            <span className="text-zinc-900">BLR &apos;26</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/founders" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Founders</Link>
            <Link href="/showcase" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Showcase</Link>
            <Link href="/map" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Map</Link>
            <Link href="/networking-board" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">Board</Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link href="/card" className="text-sm text-orange-500 hover:text-orange-400 px-3 py-1.5 font-semibold transition-colors">My Card</Link>
                <Link href="/edit-profile" className="text-sm text-zinc-500 hover:text-zinc-900 px-3 py-1.5 hover:bg-zinc-100 rounded-lg transition-colors">Edit</Link>
                <Link href="/connections" className="text-sm text-zinc-500 hover:text-zinc-900 px-3 py-1.5 hover:bg-zinc-100 rounded-lg transition-colors">Connections</Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5">Sign in</Link>
                <Link href="/sign-up" className="text-sm bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">Join</Link>
              </>
            )}
          </div>

          {/* Mobile: auth + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <Link href="/sign-up" className="text-sm bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">Join</Link>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-100 bg-white px-4 py-3 flex flex-col gap-1">
            <Link href="/founders" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Founders</Link>
            <Link href="/showcase" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Showcase</Link>
            <Link href="/map" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Map</Link>
            <Link href="/networking-board" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Board</Link>
            {isSignedIn && (
              <>
                <div className="h-px bg-zinc-100 my-1" />
                <Link href="/card" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-orange-500 hover:bg-orange-50 rounded-xl font-semibold text-sm">My Card</Link>
                <Link href="/edit-profile" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Edit Profile</Link>
                <Link href="/connections" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Connections</Link>
              </>
            )}
            {!isSignedIn && (
              <>
                <div className="h-px bg-zinc-100 my-1" />
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-zinc-700 hover:bg-zinc-50 rounded-xl font-medium text-sm">Sign in</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Pill navbar — desktop only, on scroll */}
      {scrolled && (
        <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <nav className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg shadow-black/5 px-2 py-2">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-1">
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">YC</span>
              <span className="font-black text-zinc-900 text-sm">BLR</span>
            </Link>
            <div className="w-px h-4 bg-zinc-200 mx-1" />
            <div className="flex items-center text-sm">
              <Link href="/founders" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Founders</Link>
              <Link href="/showcase" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Showcase</Link>
              <Link href="/map" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Map</Link>
              <Link href="/networking-board" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">Board</Link>
            </div>
            <div className="w-px h-4 bg-zinc-200 mx-1" />
            <div className="flex items-center gap-1 pr-1">
              {isSignedIn ? (
                <>
                  <Link href="/edit-profile" className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors text-xs font-semibold">Edit</Link>
                  <UserButton />
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 rounded-full transition-colors">Sign in</Link>
                  <Link href="/sign-up" className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-400 text-white rounded-full transition-colors font-medium">Join</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

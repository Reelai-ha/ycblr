'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Globe, Download, ArrowLeft, QrCode, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Founder {
  id: string; name: string; company: string; tagline: string
  website: string; twitter: string; category: string; description: string
  clerk_user_id?: string; profile_photo_url?: string
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function CardContent() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const viewId = searchParams.get('id')

  const [founder, setFounder] = useState<Founder | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const cardUrl = founder ? `https://ycblr.xyz/card?id=${founder.id}` : ''

  useEffect(() => {
    async function load() {
      if (viewId) {
        const { data } = await supabase.from('founders').select('*').eq('id', viewId).single()
        setFounder(data)
      } else if (isLoaded && user) {
        const { data } = await supabase.from('founders').select('*').eq('clerk_user_id', user.id).single()
        setFounder(data)
      } else if (isLoaded && !user) {
        setFounder(null)
      }
      setLoading(false)
    }
    load()
  }, [user, isLoaded, viewId])

  const isOwnCard = !viewId || (user && founder && founder.clerk_user_id === user.id)

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: `${founder?.name} — YC BLR '26`, url: cardUrl })
    } else {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleDownload() {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 400
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }))
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${founder?.name || 'card'}-qr-yc-blr.png`
      a.click()
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!founder && !viewId && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
        <div className="text-5xl mb-4">🪪</div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">Sign in to view your card</h2>
        <p className="text-zinc-500 text-sm mb-6">Your digital card and QR code are waiting.</p>
        <Link href="/sign-in" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          Sign in →
        </Link>
      </div>
    )
  }

  if (!founder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
        <div className="text-5xl mb-4">🪪</div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">{viewId ? 'Profile not found' : 'No profile yet'}</h2>
        <p className="text-zinc-500 text-sm mb-6">
          {viewId ? "This founder hasn't set up their profile yet." : 'Create your founder profile first to get your digital card.'}
        </p>
        {!viewId && (
          <Link href="/onboarding" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Create profile →
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">

      {/* Back link */}
      {viewId && (
        <div className="w-full max-w-sm px-5 pt-5">
          <Link href="/founders" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 text-sm transition-colors">
            <ArrowLeft size={14} /> All founders
          </Link>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm px-5 py-8">

        {/* Card */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/60 mb-5">

          {/* Cover / hero */}
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-7 pt-10 pb-8 relative">
            {/* subtle grid pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

            {/* YC badge top right */}
            <div className="absolute top-5 right-5 bg-zinc-950/20 backdrop-blur-sm border border-white/20 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl leading-tight text-center">
              <div className="text-sm">YC</div>
              <div>BLR &apos;26</div>
            </div>

            {/* Avatar */}
            {founder.profile_photo_url ? (
              <img src={founder.profile_photo_url} alt={founder.name}
                className="w-20 h-20 rounded-2xl border-2 border-white/30 mb-4 shadow-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-zinc-950/20 backdrop-blur-sm border-2 border-white/30 text-white font-black text-2xl flex items-center justify-center mb-4 shadow-xl">
                {getInitials(founder.name)}
              </div>
            )}

            {/* Name & company */}
            <h1 className="text-2xl font-black text-white leading-tight mb-0.5">{founder.name}</h1>
            <p className="text-white/75 font-medium text-sm">{founder.company}</p>

            {/* Tagline */}
            {founder.tagline && (
              <p className="text-white/60 text-xs mt-2 leading-relaxed max-w-[220px]">{founder.tagline}</p>
            )}
          </div>

          {/* Contact rows */}
          <div className="bg-zinc-900 divide-y divide-zinc-800">
            {founder.website && (
              <a href={founder.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                  <Globe size={17} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest mb-0.5">Website</p>
                  <p className="text-white text-sm font-semibold truncate">
                    {founder.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg">›</span>
              </a>
            )}

            {founder.twitter && (
              <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center shrink-0 text-white font-bold text-base">
                  𝕏
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest mb-0.5">Twitter / X</p>
                  <p className="text-white text-sm font-semibold">@{founder.twitter.replace('@', '')}</p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg">›</span>
              </a>
            )}

            {/* QR row */}
            <button onClick={() => setShowQR(true)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center shrink-0">
                <QrCode size={17} className="text-zinc-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest mb-0.5">QR Code</p>
                <p className="text-white text-sm font-semibold">Tap to show & share</p>
              </div>
              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg">›</span>
            </button>
          </div>

          {/* Card footer */}
          <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
            <span className="text-[10px] text-zinc-600 font-semibold tracking-wider uppercase">YC Startup School · BLR · Apr 18</span>
            <span className="text-[10px] text-orange-500 font-bold">ycblr.xyz</span>
          </div>
        </div>

        {/* Action buttons */}
        {isOwnCard && (
          <div className="w-full flex flex-col sm:flex-row gap-2.5 mb-4">
            <button onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm shadow-lg shadow-orange-500/20">
              <Share2 size={15} />
              {copied ? '✓ Copied!' : 'Share card'}
            </button>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm at @ycombinator Startup School Bangalore 🇮🇳\n\nBuilding ${founder.company} — ${founder.tagline}\n\nScan my digital card 👇`)}&url=${encodeURIComponent(cardUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 px-5 rounded-2xl transition-colors text-sm border border-zinc-700">
              𝕏 Tweet
            </a>
            <Link href="/edit-profile"
              className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold py-3.5 px-5 rounded-2xl transition-colors text-sm">
              ✏️ Edit
            </Link>
          </div>
        )}

        {/* Public: visit + own card CTA */}
        {viewId && !isOwnCard && (
          <div className="w-full flex flex-col gap-3 mb-4">
            {founder.website && (
              <a href={founder.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm">
                <Globe size={15} /> Visit {founder.company}
              </a>
            )}
            {!user && (
              <Link href="/sign-up"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-lg shadow-orange-500/20">
                ✨ Get your own card free →
              </Link>
            )}
          </div>
        )}

        <p className="text-center text-xs text-zinc-500">
          {isOwnCard ? 'Share this link · anyone can view your card instantly' : 'Attending YC Startup School Bangalore · April 18, 2026'}
        </p>
      </div>

      {/* QR modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-7 mb-2 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors">
              <X size={14} />
            </button>

            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-6 text-center">Scan to view profile</p>

            <div ref={qrRef} className="flex justify-center mb-6">
              <div className="p-4 bg-zinc-950 rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={cardUrl}
                  size={200}
                  fgColor="#09090b"
                  bgColor="#ffffff"
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>

            <p className="text-zinc-500 text-xs text-center mb-6 leading-relaxed">
              {founder.name} · {founder.company}<br />
              <span className="text-zinc-600">YC Startup School Bangalore · Apr 18 2026</span>
            </p>

            {isOwnCard && (
              <button onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                <Download size={14} /> Download QR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CardContent />
    </Suspense>
  )
}

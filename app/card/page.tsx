'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Globe, ExternalLink, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Founder {
  id: string; name: string; company: string; tagline: string
  website: string; twitter: string; category: string; description: string
  clerk_user_id?: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'AI/ML': { bg: '#f3e8ff', text: '#7e22ce' },
  'SaaS': { bg: '#eff6ff', text: '#1d4ed8' },
  'Dev Tools': { bg: '#ecfeff', text: '#0e7490' },
  'Fintech': { bg: '#ecfdf5', text: '#065f46' },
  'Health': { bg: '#fff1f2', text: '#be123c' },
  'Consumer': { bg: '#fffbeb', text: '#92400e' },
  'Other': { bg: '#f4f4f5', text: '#52525b' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function CardContent() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const viewId = searchParams.get('id') // ?id=xxx for public viewing

  const [founder, setFounder] = useState<Founder | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [qrFlipped, setQrFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // The public URL for this card — always links to /card?id=founderId
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const cardUrl = founder ? `${origin}/card?id=${founder.id}` : ''

  useEffect(() => {
    async function load() {
      if (viewId) {
        // Public view: load by founder id
        const { data } = await supabase.from('founders').select('*').eq('id', viewId).single()
        setFounder(data)
      } else if (isLoaded && user) {
        // Own card view
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
    // Download QR as PNG using canvas trick
    const svg = cardRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = `${founder?.name || 'card'}-qr-yc-blr.png`
      a.click()
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!founder && !viewId && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🪪</div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">{viewId ? 'Profile not found' : 'No profile yet'}</h2>
        <p className="text-zinc-500 text-sm mb-6">
          {viewId
            ? 'This founder hasn\'t set up their profile yet.'
            : 'Create your founder profile first to get your digital card and QR code.'
          }
        </p>
        {!viewId && (
          <Link href="/onboarding" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Create profile →
          </Link>
        )}
      </div>
    )
  }

  const catColors = CATEGORY_COLORS[founder.category] || CATEGORY_COLORS['Other']

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Back link for public view */}
      {viewId && (
        <div className="max-w-sm mx-auto px-4 pt-6">
          <Link href="/founders" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
            <ArrowLeft size={14} /> All founders
          </Link>
        </div>
      )}

      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-sm">

          {/* ── The Card ── */}
          <div ref={cardRef} className="bg-white rounded-3xl shadow-2xl shadow-orange-200/70 border border-orange-100 overflow-hidden mb-5 relative">

            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

            {/* Front side */}
            <div className="p-7">

              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-orange-300/50 shrink-0">
                    {getInitials(founder.name)}
                  </div>
                  <div>
                    <h1 className="font-black text-zinc-900 text-xl leading-tight">{founder.name}</h1>
                    <p className="text-zinc-500 text-sm">{founder.company}</p>
                    {founder.category && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold"
                        style={{ backgroundColor: catColors.bg, color: catColors.text }}
                      >
                        {founder.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* YC badge */}
                <div className="flex flex-col items-center bg-orange-500 text-white text-[10px] font-black px-2 py-1.5 rounded-xl shrink-0 leading-tight">
                  <span className="text-base leading-none">YC</span>
                  <span>BLR</span>
                  <span>&apos;26</span>
                </div>
              </div>

              {/* Tagline / description */}
              {founder.tagline && (
                <p className="text-zinc-700 font-semibold text-sm leading-snug mb-1">{founder.tagline}</p>
              )}
              {founder.description && (
                <p className="text-zinc-400 text-xs leading-relaxed mb-5 line-clamp-2">{founder.description}</p>
              )}

              {/* Divider */}
              <div className="border-t border-zinc-100 my-4" />

              {/* QR section — flip on click to see bigger */}
              <div
                className={`transition-all duration-500 ${qrFlipped ? '' : ''}`}
              >
                {qrFlipped ? (
                  /* Expanded QR */
                  <div className="flex flex-col items-center gap-3 py-2" onClick={() => setQrFlipped(false)}>
                    <div className="p-3 bg-white border-2 border-orange-200 rounded-2xl shadow-inner cursor-pointer">
                      <QRCodeSVG
                        value={cardUrl}
                        size={200}
                        fgColor="#09090b"
                        bgColor="#ffffff"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">Tap QR to shrink&nbsp;·&nbsp;Scan to view profile</p>
                  </div>
                ) : (
                  /* Compact row */
                  <div className="flex items-center gap-4">
                    <div
                      className="p-2.5 bg-white border-2 border-orange-100 rounded-2xl shadow-sm cursor-pointer hover:border-orange-300 transition-colors shrink-0"
                      onClick={() => setQrFlipped(true)}
                      title="Tap to enlarge"
                    >
                      <QRCodeSVG
                        value={cardUrl}
                        size={80}
                        fgColor="#09090b"
                        bgColor="#ffffff"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 mb-0.5">Scan to connect</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">Scan with camera to see my full profile</p>
                      <div className="flex flex-col gap-1">
                        {founder.website && (
                          <a href={founder.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-orange-500 flex items-center gap-1 font-medium truncate hover:text-orange-400">
                            <Globe size={10} className="shrink-0" />
                            {founder.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                        {founder.twitter && (
                          <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                            𝕏 @{founder.twitter.replace('@', '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-300 font-semibold tracking-wide">YC STARTUP SCHOOL · BLR · APR 18 2026</span>
                <span className="text-[10px] text-orange-300 font-bold">@kiaan_mittal</span>
              </div>
            </div>
          </div>

          {/* ── Action buttons ── */}
          {isOwnCard && (
            <div className="flex gap-2.5 mb-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-2xl transition-colors text-sm shadow-lg shadow-orange-200"
              >
                <Share2 size={15} />
                {copied ? '✓ Link copied!' : 'Share my card'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 font-semibold py-3 px-4 rounded-2xl transition-colors text-sm shadow-sm"
                title="Download QR code"
              >
                <Download size={15} />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm at @ycombinator Startup School Bangalore 🇮🇳\n\nBuilding ${founder.company} — ${founder.tagline}\n\nScan my digital card 👇`)}&url=${encodeURIComponent(cardUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-2xl transition-colors text-sm"
              >
                𝕏
              </a>
            </div>
          )}

          {/* Public view: link to own card */}
          {viewId && !isOwnCard && (
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex gap-2.5">
                {founder.website && (
                  <a href={founder.website} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-semibold py-3 rounded-2xl transition-colors text-sm shadow-sm">
                    <ExternalLink size={15} /> Visit {founder.company}
                  </a>
                )}
                {founder.twitter && (
                  <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-2xl transition-colors text-sm">
                    𝕏
                  </a>
                )}
              </div>

              {!user && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl transition-all text-base shadow-lg shadow-orange-200 group"
                  >
                    ✨ Make your own card
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <p className="text-center text-xs text-zinc-400">
                    Already have a profile? <Link href="/sign-in" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-zinc-400">
            {isOwnCard
              ? 'Share this link · people will see your full card instantly'
              : `Attending YC Startup School Bangalore · April 18, 2026`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CardContent />
    </Suspense>
  )
}

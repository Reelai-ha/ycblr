'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { X, ExternalLink } from 'lucide-react'

interface Founder { id: string; name: string; company: string; tagline: string; description: string; website: string; twitter: string; category: string }
interface Showcase { id: string; product_name: string; tagline: string; description: string; category: string; upvotes: number; website: string; logo_url: string }

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-200',
  'SaaS': 'bg-blue-50 text-blue-600 border-blue-200',
  'Dev Tools': 'bg-cyan-50 text-cyan-600 border-cyan-200',
  'Fintech': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Health': 'bg-rose-50 text-rose-600 border-rose-200',
  'Consumer': 'bg-amber-50 text-amber-600 border-amber-200',
  'Other': 'bg-zinc-50 text-zinc-600 border-zinc-200',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function FounderModal({ founder, onClose }: { founder: Founder; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500">
            <X size={14} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 font-black text-lg flex items-center justify-center shrink-0">
              {getInitials(founder.name)}
            </div>
            <div>
              <h2 className="font-black text-zinc-900 text-xl">{founder.name}</h2>
              <p className="text-zinc-500 text-sm">{founder.company}</p>
              {founder.category && (
                <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${CATEGORY_COLORS[founder.category] || CATEGORY_COLORS['Other']}`}>
                  {founder.category}
                </span>
              )}
            </div>
          </div>
          {founder.tagline && <p className="font-semibold text-zinc-800 mb-2">{founder.tagline}</p>}
          {founder.description && <p className="text-zinc-500 text-sm leading-relaxed mb-5">{founder.description}</p>}
          <div className="flex flex-col gap-2">
            {founder.website && (
              <a href={founder.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                <ExternalLink size={14} /> Visit {founder.company}
              </a>
            )}
            {founder.twitter && (
              <a href={`https://twitter.com/${founder.twitter}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
                𝕏 @{founder.twitter}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ShowcaseModal({ item, onClose }: { item: Showcase; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-500">
            <X size={14} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-black text-zinc-900 text-xl">{item.product_name}</h2>
            <span className="text-zinc-400 text-sm flex items-center gap-1">▲ {item.upvotes}</span>
          </div>
          {item.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full border mb-4 inline-block ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other']}`}>
              {item.category}
            </span>
          )}
          {item.tagline && <p className="font-semibold text-zinc-800 mb-2">{item.tagline}</p>}
          {item.description && <p className="text-zinc-500 text-sm leading-relaxed mb-5">{item.description}</p>}
          {item.website && (
            <a href={item.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm w-full">
              <ExternalLink size={14} /> Visit {item.product_name}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [founders, setFounders] = useState<Founder[]>([])
  const [showcase, setShowcase] = useState<Showcase[]>([])
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null)
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: f }, { data: s }] = await Promise.all([
        supabase.from('founders').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('showcases').select('*').order('upvotes', { ascending: false }).limit(3),
      ])
      setFounders(f || [])
      setShowcase(s || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="relative">
      {/* Orange top glow */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-orange-50 to-white -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">

        {/* Hero */}
        <div className="pt-20 pb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-600 text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            April 18, 2026 · Bangalore
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-5">
              Meet every founder<br />
              at <span className="text-orange-500">YC Startup School</span><br />
              Bangalore.
            </h1>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              200+ founders. One room. Don&apos;t leave without knowing who&apos;s there — browse profiles, track who you met, and showcase what you&apos;re building.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-orange-200">
                Add your profile →
              </Link>
              <Link href="/founders" className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold px-7 py-3 rounded-xl transition-colors text-sm shadow-sm">
                Browse founders
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20 border-t border-zinc-100 pt-16">
          <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-10">How it works</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your profile', desc: 'Sign up and add your name, company, what you\'re building, and how to reach you. Takes 2 minutes.' },
              { step: '02', title: 'Find people to talk to', desc: 'Browse the directory before or at the event. Filter by category, search by name or product.' },
              { step: '03', title: 'Track who you met', desc: 'Log connections with private notes after each conversation. Never lose a follow-up again.' },
            ].map(item => (
              <div key={item.step} className="flex gap-5">
                <span className="text-orange-300 font-black text-3xl leading-none mt-0.5 shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-zinc-900 font-bold mb-1.5">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Founders */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-zinc-900">Latest Founders</h2>
              <p className="text-zinc-400 text-sm mt-1">Recently joined the directory</p>
            </div>
            <Link href="/founders" className="text-sm text-orange-500 hover:text-orange-400 transition-colors font-semibold">View all →</Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-40 animate-pulse" />)}
            </div>
          ) : founders.length === 0 ? (
            <div className="border border-dashed border-zinc-200 rounded-2xl py-16 text-center">
              <div className="text-4xl mb-3">👋</div>
              <p className="text-zinc-500 font-semibold mb-1">No founders yet</p>
              <p className="text-zinc-400 text-sm mb-5">Be the first to add your profile to the directory.</p>
              <Link href="/sign-up" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Add your profile →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-5">
              {founders.map(f => (
                <button key={f.id} onClick={() => setSelectedFounder(f)}
                  className="text-left group bg-white hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-lg cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-orange-200">
                      {getInitials(f.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-zinc-900 text-base truncate">{f.name}</div>
                      <div className="text-zinc-500 text-sm truncate">{f.company}</div>
                    </div>
                  </div>
                  {f.category && (
                    <span className={`text-xs px-2.5 py-1 rounded-full border w-fit block mb-3 font-medium ${CATEGORY_COLORS[f.category] || CATEGORY_COLORS['Other']}`}>
                      {f.category}
                    </span>
                  )}
                  {f.tagline && <p className="text-zinc-500 text-sm leading-relaxed">{f.tagline}</p>}
                  <div className="flex items-center gap-1 mt-4 text-orange-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Latest Products */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-zinc-900">Latest Products</h2>
              <p className="text-zinc-400 text-sm mt-1">What founders are building</p>
            </div>
            <Link href="/showcase" className="text-sm text-orange-500 hover:text-orange-400 transition-colors font-semibold">View all →</Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-52 animate-pulse" />)}
            </div>
          ) : showcase.length === 0 ? (
            <div className="border border-dashed border-zinc-200 rounded-2xl py-16 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-zinc-500 font-semibold mb-1">No products yet</p>
              <p className="text-zinc-400 text-sm mb-5">Be the first to showcase your product to the community.</p>
              <Link href="/showcase/new" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Add your product →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-5">
              {showcase.map(item => (
                <button key={item.id} onClick={() => setSelectedShowcase(item)}
                  className="text-left group bg-white hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-lg cursor-pointer">
                  {/* Colored top strip */}
                  <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 w-full" />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-black text-zinc-900 text-lg leading-tight">{item.product_name}</h3>
                      <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 text-orange-500 text-xs font-bold px-2 py-1 rounded-lg shrink-0">
                        ▲ {item.upvotes}
                      </div>
                    </div>
                    {item.category && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border w-fit block mb-3 font-medium ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other']}`}>
                        {item.category}
                      </span>
                    )}
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.tagline}</p>
                    <div className="flex items-center gap-1 mt-4 text-orange-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View product <span>→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Feature cards */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: '🔍', title: 'Find Founders', desc: 'Browse every founder attending. Filter by what they build, search by name — find your next co-founder or customer.', href: '/founders', cta: 'Browse directory' },
              { icon: '🚀', title: 'Showcase Your Product', desc: 'Get your product seen by 200+ founders in one shot. Add it to the showcase and collect upvotes.', href: '/showcase', cta: 'Add product' },
              { icon: '🤝', title: 'Network Smarter', desc: 'Read the playbook for working the room. Then use the tracker to log everyone you meet with private notes.', href: '/networking-tips', cta: 'Read the guide' },
            ].map(card => (
              <Link key={card.title} href={card.href}
                className="group flex flex-col bg-white hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 rounded-2xl p-7 transition-all shadow-sm hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl mb-5 group-hover:bg-orange-200 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-zinc-900 font-black text-xl mb-2">{card.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">{card.desc}</p>
                <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-400 transition-colors">
                  {card.cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Twitter banner */}
        <div className="mb-20 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 overflow-hidden">
          <div className="px-8 py-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <p className="text-orange-400 text-sm mb-1 font-medium">Built by</p>
              <h3 className="text-2xl font-black text-zinc-900 mb-1">@kiaan_mittal</h3>
              <p className="text-zinc-500 text-sm">Follow for updates on this tool and more open source projects</p>
            </div>
            <a href="https://twitter.com/intent/follow?screen_name=kiaan_mittal" target="_blank" rel="noopener noreferrer"
              className="shrink-0 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-orange-200">
              Follow on X
            </a>
          </div>
        </div>

      </div>

      {selectedFounder && <FounderModal founder={selectedFounder} onClose={() => setSelectedFounder(null)} />}
      {selectedShowcase && <ShowcaseModal item={selectedShowcase} onClose={() => setSelectedShowcase(null)} />}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { X, ExternalLink } from 'lucide-react'

interface Founder {
  id: string; name: string; company: string; tagline: string
  description: string; website: string; twitter: string; category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-200',
  'SaaS': 'bg-blue-50 text-blue-600 border-blue-200',
  'Dev Tools': 'bg-cyan-50 text-cyan-600 border-cyan-200',
  'Fintech': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Health': 'bg-rose-50 text-rose-600 border-rose-200',
  'Consumer': 'bg-amber-50 text-amber-600 border-amber-200',
  'Other': 'bg-zinc-50 text-zinc-500 border-zinc-200',
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
                <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 w-fit inline-block ${CATEGORY_COLORS[founder.category] || CATEGORY_COLORS['Other']}`}>
                  {founder.category}
                </span>
              )}
            </div>
          </div>
          {founder.tagline && <p className="font-semibold text-zinc-800 mb-2">{founder.tagline}</p>}
          {founder.description && <p className="text-zinc-500 text-sm leading-relaxed mb-5">{founder.description}</p>}
          <div className="flex flex-col gap-2">
            <Link href={`/card?id=${founder.id}`} target="_blank"
              className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              🪪 View Digital Card
            </Link>
            {founder.website && (
              <a href={founder.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                <ExternalLink size={14} /> Visit {founder.company}
              </a>
            )}
            {founder.twitter && (
              <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
                𝕏 @{founder.twitter.replace('@', '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FoundersPage() {
  const { isSignedIn } = useUser()
  const [founders, setFounders] = useState<Founder[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Founder | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('founders').select('*').order('created_at', { ascending: false })
        if (error) {
          console.error('Error fetching founders:', error)
          setFounders([])
        } else {
          setFounders(data || [])
        }
      } catch (err) {
        console.error('Failed to load founders:', err)
        setFounders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = founders.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Founders</h1>
          <p className="text-zinc-400 text-sm mt-1">Attending YC Startup School Bangalore · April 18, 2026</p>
        </div>
        {isSignedIn ? (
          <Link href="/onboarding" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors self-start shadow-lg shadow-orange-100">
            + Add Your Profile
          </Link>
        ) : (
          <Link href="/sign-up" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors self-start shadow-lg shadow-orange-100">
            + Join Directory
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by name or company..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl mb-8 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 && founders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-black text-zinc-900 mb-2">No founders yet</h2>
          <p className="text-zinc-400 text-sm mb-6">Be the first to add your profile to the directory!</p>
          <Link href="/sign-up" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Add your profile →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(f => (
              <button key={f.id} onClick={() => setSelected(f)}
                className="text-left group bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-200 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {getInitials(f.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-zinc-900 truncate">{f.name}</div>
                    <div className="text-zinc-400 text-sm truncate">{f.company}</div>
                    {f.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${CATEGORY_COLORS[f.category] || CATEGORY_COLORS['Other']}`}>
                        {f.category}
                      </span>
                    )}
                  </div>
                </div>
                {f.tagline && <p className="text-zinc-500 text-sm leading-relaxed">{f.tagline}</p>}
                <p className="text-orange-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-auto">View profile →</p>
              </button>
            ))}
          </div>
          {!loading && filtered.length === 0 && search && (
            <div className="text-center py-20 text-zinc-400">No founders found matching &quot;{search}&quot;</div>
          )}
        </>
      )}

      {selected && <FounderModal founder={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

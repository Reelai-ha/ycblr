'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { X, ExternalLink } from 'lucide-react'

interface Showcase {
  id: string; product_name: string; tagline: string; description: string
  website: string; category: string; logo_url: string; upvotes: number
}

const CATEGORIES = ['All', 'SaaS', 'AI/ML', 'Dev Tools', 'Fintech', 'Health', 'Consumer', 'Other']

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-200',
  'SaaS': 'bg-blue-50 text-blue-600 border-blue-200',
  'Dev Tools': 'bg-cyan-50 text-cyan-600 border-cyan-200',
  'Fintech': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Health': 'bg-rose-50 text-rose-600 border-rose-200',
  'Consumer': 'bg-amber-50 text-amber-600 border-amber-200',
  'Other': 'bg-zinc-50 text-zinc-500 border-zinc-200',
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
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-black text-zinc-900 text-xl">{item.product_name}</h2>
            <span className="text-zinc-400 text-sm">▲ {item.upvotes}</span>
          </div>
          {item.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full border mb-4 inline-block ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other']}`}>
              {item.category}
            </span>
          )}
          {item.tagline && <p className="font-semibold text-zinc-800 mb-2 mt-3">{item.tagline}</p>}
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

export default function ShowcasePage() {
  const { isSignedIn } = useUser()
  const [items, setItems] = useState<Showcase[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Showcase | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('showcases').select('*').order('upvotes', { ascending: false })
      setItems(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Showcase</h1>
          <p className="text-zinc-400 text-sm mt-1">Products being built by the community</p>
        </div>
        {isSignedIn ? (
          <Link href="/showcase/new" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors self-start shadow-lg shadow-orange-100">
            + Add Your Product
          </Link>
        ) : (
          <Link href="/sign-up" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors self-start shadow-lg shadow-orange-100">
            + Add Your Product
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === cat
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
              }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-52 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-black text-zinc-900 mb-2">No products yet</h2>
          <p className="text-zinc-400 text-sm mb-6">Be the first founder to showcase your product to the community!</p>
          <Link href="/showcase/new" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Add your product →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <button key={item.id} onClick={() => setSelected(item)}
                className="text-left group bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-200 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{item.product_name}</h3>
                    {item.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other']}`}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-400 text-xs flex items-center gap-1 shrink-0 mt-1">▲ {item.upvotes}</span>
                </div>
                {item.tagline && <p className="text-zinc-700 text-sm font-medium">{item.tagline}</p>}
                {item.description && <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>}
                <div className="flex items-center justify-between mt-auto pt-1">
                  {item.website && (
                    <span onClick={e => { e.stopPropagation(); window.open(item.website, '_blank') }}
                      className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors cursor-pointer">
                      <ExternalLink size={12} /> Visit site
                    </span>
                  )}
                  <span className="text-orange-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-auto">View details →</span>
                </div>
              </button>
            ))}
          </div>
          {!loading && filtered.length === 0 && filter !== 'All' && (
            <div className="text-center py-20 text-zinc-400">No products in this category yet.</div>
          )}
        </>
      )}

      {selected && <ShowcaseModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

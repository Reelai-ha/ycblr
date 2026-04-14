'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TickerItem {
  id: string
  label: string
  type: 'founder' | 'startup'
}

export default function Ticker() {
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    async function load() {
      const [{ data: founders }, { data: showcases }] = await Promise.all([
        supabase.from('founders').select('id, name, company'),
        supabase.from('showcases').select('id, product_name'),
      ])

      const combined: TickerItem[] = [
        ...(founders || []).map(f => ({ id: f.id, label: `${f.name} · ${f.company}`, type: 'founder' as const })),
        ...(showcases || []).map(s => ({ id: s.id, label: s.product_name, type: 'startup' as const })),
      ]

      setItems(combined.sort(() => Math.random() - 0.5))
    }
    load()
  }, [])

  if (items.length === 0) return null

  const displayItems = [...items, ...items, ...items]

  return (
    <div className="flex items-stretch border-b border-zinc-100 bg-white overflow-hidden h-9">
      {/* Fixed label */}
      <div className="shrink-0 flex items-center gap-2 px-4 bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest z-10 border-r border-orange-600">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        Live
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex items-center h-full animate-marquee whitespace-nowrap">
          {displayItems.map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center gap-2.5 mx-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
                {item.type === 'founder' ? '👤' : '🚀'}
              </span>
              <span className="text-[12px] font-semibold text-zinc-600">
                {item.label}
              </span>
              <span className="text-zinc-200 text-xs">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

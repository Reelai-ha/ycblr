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
                ...(founders || []).map(f => ({ id: f.id, label: `${f.name} (${f.company})`, type: 'founder' as const })),
                ...(showcases || []).map(s => ({ id: s.id, label: s.product_name, type: 'startup' as const })),
            ]

            // Shuffle items for variety
            setItems(combined.sort(() => Math.random() - 0.5))
        }
        load()
    }, [])

    if (items.length === 0) return null

    // Duplicate items for seamless loop
    const displayItems = [...items, ...items, ...items]

    return (
        <div className="bg-orange-500 text-white py-2 overflow-hidden whitespace-nowrap border-y border-orange-600">
            <div className="inline-block animate-marquee hover:pause-animation">
                {displayItems.map((item, i) => (
                    <span key={`${item.id}-${i}`} className="mx-8 font-bold text-sm uppercase tracking-wider">
                        {item.type === 'founder' ? '👤' : '🚀'} {item.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

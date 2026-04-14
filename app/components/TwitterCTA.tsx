'use client'

import { useEffect, useState } from 'react'

export default function TwitterCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300 && !dismissed) setVisible(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="relative bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xl shadow-black/10 w-72">
        <button
          onClick={() => { setDismissed(true); setVisible(false) }}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 transition-colors text-xl leading-none"
        >
          ×
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0">K</div>
          <div>
            <div className="font-bold text-zinc-900 text-sm">Kiaan Mittal</div>
            <div className="text-zinc-400 text-xs">@kiaan_mittal</div>
          </div>
        </div>
        <p className="text-zinc-500 text-xs leading-relaxed mb-4">
          Built this open-source directory for YC Startup School Bangalore. If you find it useful, a follow means a lot! 🙏
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://twitter.com/intent/follow?screen_name=kiaan_mittal"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white py-2 rounded-xl transition-colors"
          >
            Follow @kiaan_mittal
          </a>
          <a
            href="https://twitter.com/kiaan_mittal"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-sm text-zinc-400 hover:text-zinc-700 transition-colors py-1"
          >
            View tweets →
          </a>
        </div>
      </div>
    </div>
  )
}

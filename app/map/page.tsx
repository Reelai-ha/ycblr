'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Plus, X, MapPin, Clock, Users } from 'lucide-react'

interface Pin {
  id: string; clerk_user_id: string; name: string; title: string
  location_key: string; time_slot: string; attendee_count: number; created_at: string
}

const ZONES = [
  {
    key: 'stage',
    label: 'Stage 🎤',
    desc: 'Main talks & keynotes',
    color: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-500',
    position: 'col-span-2 row-span-1',
    icon: '🎤',
  },
  {
    key: 'demo',
    label: 'Demo Tables 🖥️',
    desc: 'Product demos & pitches',
    color: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-500',
    position: 'col-span-1 row-span-2',
    icon: '🖥️',
  },
  {
    key: 'networking',
    label: 'Networking Zone 🤝',
    desc: 'Main meeting area',
    color: 'bg-emerald-500',
    textColor: 'text-white',
    borderColor: 'border-emerald-500',
    position: 'col-span-1 row-span-2',
    icon: '🤝',
  },
  {
    key: 'coffee',
    label: 'Coffee Area ☕',
    desc: 'Breaks & casual chats',
    color: 'bg-amber-500',
    textColor: 'text-white',
    borderColor: 'border-amber-500',
    position: 'col-span-2 row-span-1',
    icon: '☕',
  },
  {
    key: 'entrance',
    label: 'Entrance 🚪',
    desc: 'Registration & welcome',
    color: 'bg-zinc-700',
    textColor: 'text-white',
    borderColor: 'border-zinc-700',
    position: 'col-span-2 row-span-1',
    icon: '🚪',
  },
]

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
]

const PIN_COLORS: Record<string, string> = {
  stage: 'bg-orange-500',
  demo: 'bg-blue-500',
  networking: 'bg-emerald-500',
  coffee: 'bg-amber-500',
  entrance: 'bg-zinc-600',
}

export default function MapPage() {
  const { user, isSignedIn } = useUser()
  const [pins, setPins] = useState<Pin[]>([])
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [showPinForm, setShowPinForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [founderName, setFounderName] = useState('')
  const [form, setForm] = useState({ title: '', time_slot: '3:00 PM', attendee_count: 1 })

  async function load() {
    try {
      const { data, error } = await supabase.from('event_pins').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setPins(data || [])
    } catch {
      setPins([])
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('founders').select('name').eq('clerk_user_id', user.id).single()
      .then(({ data }) => data && setFounderName(data.name))
  }, [user])

  const pinsForZone = (key: string) => pins.filter(p => p.location_key === key)

  async function handleAddPin(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedZone) return
    setSaving(true)
    try {
      const { error } = await supabase.from('event_pins').insert({
        clerk_user_id: user.id,
        name: founderName || 'Anonymous',
        location_key: selectedZone,
        ...form,
      })
      if (error) throw error
    } catch {
      // table may not exist yet — silently fail
    }
    setForm({ title: '', time_slot: '3:00 PM', attendee_count: 1 })
    setShowPinForm(false)
    setSelectedZone(null)
    setSaving(false)
    load()
  }

  async function handleDeletePin(id: string) {
    await supabase.from('event_pins').delete().eq('id', id)
    setPins(p => p.filter(x => x.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Event Map</h1>
          <p className="text-zinc-400 text-sm mt-1">Click a zone to drop a meetup pin · April 18, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {pins.length} active {pins.length === 1 ? 'pin' : 'pins'}
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-8 font-medium">
        💡 Drop a pin to coordinate real-world meetups — &ldquo;AI founders meeting here at 3pm&rdquo;
      </p>

      {/* Map layout */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Stage — top, full width */}
        <MapZone zone={ZONES[0]} pins={pinsForZone('stage')} user={user}
          onClick={() => { setSelectedZone('stage'); setShowPinForm(true) }}
          onDeletePin={handleDeletePin} />

        {/* Demo + Networking — middle row */}
        <MapZone zone={ZONES[1]} pins={pinsForZone('demo')} user={user}
          onClick={() => { setSelectedZone('demo'); setShowPinForm(true) }}
          onDeletePin={handleDeletePin} />
        <MapZone zone={ZONES[2]} pins={pinsForZone('networking')} user={user}
          onClick={() => { setSelectedZone('networking'); setShowPinForm(true) }}
          onDeletePin={handleDeletePin} />

        {/* Coffee — full width */}
        <MapZone zone={ZONES[3]} pins={pinsForZone('coffee')} user={user}
          onClick={() => { setSelectedZone('coffee'); setShowPinForm(true) }}
          onDeletePin={handleDeletePin} />

        {/* Entrance — full width */}
        <MapZone zone={ZONES[4]} pins={pinsForZone('entrance')} user={user}
          onClick={() => { setSelectedZone('entrance'); setShowPinForm(true) }}
          onDeletePin={handleDeletePin} />
      </div>

      {/* Pin form modal */}
      {showPinForm && selectedZone && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowPinForm(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowPinForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500">
                <X size={14} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className={`w-3 h-3 rounded-full ${PIN_COLORS[selectedZone] || 'bg-zinc-500'}`} />
                <h2 className="font-black text-zinc-900">Drop a pin in {ZONES.find(z => z.key === selectedZone)?.label}</h2>
              </div>

              {!isSignedIn ? (
                <p className="text-zinc-500 text-sm">
                  <a href="/sign-in" className="text-orange-500 font-semibold">Sign in</a> to drop a pin on the map.
                </p>
              ) : (
                <form onSubmit={handleAddPin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">What&apos;s happening?</label>
                    <input required value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder='e.g. "AI founders meetup" or "Looking for co-founder"'
                      className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Time</label>
                      <select value={form.time_slot} onChange={e => setForm(f => ({ ...f, time_slot: e.target.value }))}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5">People expected</label>
                      <input type="number" min={1} max={50} value={form.attendee_count}
                        onChange={e => setForm(f => ({ ...f, attendee_count: parseInt(e.target.value) }))}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                    {saving ? 'Dropping pin...' : '📍 Drop pin'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live pins list */}
      {pins.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-zinc-900 mb-4">Live Pins</h2>
          <div className="space-y-3">
            {pins.map(pin => {
              const zone = ZONES.find(z => z.key === pin.location_key)
              return (
                <div key={pin.id} className="group flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${PIN_COLORS[pin.location_key] || 'bg-zinc-500'} flex items-center justify-center text-lg shrink-0`}>
                    {zone?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 text-sm">{pin.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-zinc-400 text-xs flex items-center gap-1"><MapPin size={10} /> {zone?.label}</span>
                      <span className="text-zinc-400 text-xs flex items-center gap-1"><Clock size={10} /> {pin.time_slot}</span>
                      <span className="text-zinc-400 text-xs flex items-center gap-1"><Users size={10} /> {pin.attendee_count} expected</span>
                      <span className="text-zinc-500 text-xs font-medium">by {pin.name}</span>
                    </div>
                  </div>
                  {user?.id === pin.clerk_user_id && (
                    <button onClick={() => handleDeletePin(pin.id)}
                      className="text-zinc-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <X size={14} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MapZone({ zone, pins, user, onClick, onDeletePin }: {
  zone: typeof ZONES[0]; pins: Pin[]; user: ReturnType<typeof useUser>['user']
  onClick: () => void; onDeletePin: (id: string) => void
}) {
  const isFullWidth = ['stage', 'coffee', 'entrance'].includes(zone.key)

  return (
    <div className={`${isFullWidth ? 'col-span-2' : 'col-span-1'} relative group`}>
      <button onClick={onClick}
        className={`w-full text-left border-2 ${zone.borderColor} rounded-2xl p-5 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] ${zone.color} ${zone.textColor} relative overflow-hidden`}
        style={{ minHeight: isFullWidth ? '100px' : '160px' }}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative">
          <div className="font-black text-lg mb-0.5">{zone.label}</div>
          <div className="text-white/70 text-xs font-medium">{zone.desc}</div>
          {pins.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pins.slice(0, 3).map(pin => (
                <span key={pin.id} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                  📍 {pin.title} · {pin.time_slot}
                </span>
              ))}
              {pins.length > 3 && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg">+{pins.length - 3} more</span>
              )}
            </div>
          )}
          {pins.length === 0 && (
            <div className="mt-3 text-white/50 text-xs flex items-center gap-1">
              <Plus size={10} /> Click to drop a pin
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

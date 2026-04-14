'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Clock, MapPin, Trash2, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface MeetupRequest {
  id: string; clerk_user_id: string; name: string; company: string
  message: string; location: string; time_slot: string; category: string; created_at: string
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
]

const LOCATIONS = ['Coffee Area ☕', 'Networking Zone 🤝', 'Stage Area 🎤', 'Demo Tables 🖥️', 'Entrance 🚪', 'Anywhere']

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': 'bg-purple-100 text-purple-700 border-purple-200',
  'SaaS': 'bg-blue-100 text-blue-700 border-blue-200',
  'Dev Tools': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Fintech': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Health': 'bg-rose-100 text-rose-700 border-rose-200',
  'Consumer': 'bg-amber-100 text-amber-700 border-amber-200',
  'Other': 'bg-zinc-100 text-zinc-600 border-zinc-200',
}

export default function NetworkingBoardPage() {
  const { user, isSignedIn } = useUser()
  const [requests, setRequests] = useState<MeetupRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [founderInfo, setFounderInfo] = useState<{ name: string; company: string; category: string } | null>(null)
  const [form, setForm] = useState({ message: '', location: LOCATIONS[1], time_slot: '3:00 PM' })

  async function load() {
    try {
      const { data, error } = await supabase
        .from('meetup_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRequests(data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('founders').select('name,company,category').eq('clerk_user_id', user.id).single()
      .then(({ data }) => setFounderInfo(data))
  }, [user])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !founderInfo) return
    setSaving(true)
    await supabase.from('meetup_requests').insert({
      clerk_user_id: user.id,
      name: founderInfo.name,
      company: founderInfo.company,
      category: founderInfo.category,
      ...form,
    })
    setForm({ message: '', location: LOCATIONS[1], time_slot: '3:00 PM' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    await supabase.from('meetup_requests').delete().eq('id', id)
    setRequests(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Speed Networking</h1>
          <p className="text-zinc-400 text-sm mt-1">Post when you&apos;re free. Find people to meet at the event.</p>
        </div>
        {isSignedIn && (
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0 shadow-lg shadow-orange-100">
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Cancel' : "I'm free!"}
          </button>
        )}
        {!isSignedIn && (
          <Link href="/sign-in" className="text-sm text-orange-500 hover:text-orange-400 font-semibold">
            Sign in to post →
          </Link>
        )}
      </div>

      {/* Post form */}
      {showForm && (
        <form onSubmit={handlePost} className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8 space-y-4">
          {!founderInfo && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
              You need a <Link href="/onboarding" className="font-semibold underline">founder profile</Link> first so others know who you are.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Time slot</label>
              <select value={form.time_slot} onChange={e => setForm(f => ({ ...f, time_slot: e.target.value }))}
                className="w-full bg-white border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Location</label>
              <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full bg-white border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Message</label>
            <input
              required value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder='e.g. "Looking to chat with B2B SaaS founders"'
              className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button type="submit" disabled={saving || !founderInfo}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            {saving ? 'Posting...' : 'Post to board'}
          </button>
        </form>
      )}

      {/* Board */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⚡</div>
          <p className="text-zinc-400 text-sm">No meetup requests yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="group bg-white border border-zinc-200 hover:border-orange-200 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-black text-zinc-900">{r.name}</span>
                    <span className="text-zinc-400 text-sm">·</span>
                    <span className="text-zinc-500 text-sm">{r.company}</span>
                    {r.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${CATEGORY_COLORS[r.category] || CATEGORY_COLORS['Other']}`}>
                        {r.category}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-700 text-sm mb-3 leading-relaxed">&ldquo;{r.message}&rdquo;</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock size={12} className="text-orange-400" />
                      {r.time_slot}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin size={12} className="text-orange-400" />
                      {r.location}
                    </span>
                  </div>
                </div>
                {user?.id === r.clerk_user_id && (
                  <button onClick={() => handleDelete(r.id)}
                    className="text-zinc-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

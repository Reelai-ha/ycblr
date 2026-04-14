'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Trash2, Plus, X } from 'lucide-react'

interface Connection {
  id: string
  name: string
  company: string
  notes: string
  twitter: string
  email: string
  created_at: string
}

export default function ConnectionsPage() {
  const { user } = useUser()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', notes: '', twitter: '', email: '' })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function load() {
    if (!user) return
    const { data } = await supabase
      .from('connections')
      .select('*')
      .eq('clerk_user_id', user.id)
      .order('created_at', { ascending: false })
    setConnections(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !form.name.trim()) return
    setSaving(true)
    await supabase.from('connections').insert({ clerk_user_id: user.id, ...form })
    setForm({ name: '', company: '', notes: '', twitter: '', email: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    await supabase.from('connections').delete().eq('id', id)
    setConnections(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">My Connections</h1>
          <p className="text-zinc-500 text-sm mt-1">People you met at YC Startup School Bangalore · Private</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-orange-100"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
          <h2 className="font-bold text-zinc-900">Add Connection</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Full name"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Company</label>
              <input
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder="Company name"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Twitter / X</label>
              <div className="flex">
                <span className="bg-zinc-100 border border-r-0 border-zinc-200 text-zinc-500 px-2.5 py-2.5 rounded-l-xl text-xs">@</span>
                <input
                  value={form.twitter}
                  onChange={e => set('twitter', e.target.value.replace('@', ''))}
                  placeholder="handle"
                  className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-r-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="their@email.com"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="What did you talk about? Any follow-ups needed?"
              rows={3}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            {saving ? 'Saving...' : 'Save Connection'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-zinc-100 rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-xl font-black text-zinc-900 mb-2">No connections yet</h2>
          <p className="text-zinc-400 text-sm">Add people you meet at the event to keep track of them!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map(c => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-colors group shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-zinc-900">{c.name}</span>
                    {c.company && <span className="text-zinc-500 text-sm">· {c.company}</span>}
                    <div className="flex items-center gap-3 ml-auto">
                      {c.twitter && (
                        <a
                          href={`https://twitter.com/${c.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                        >
                          @{c.twitter}
                        </a>
                      )}
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                        >
                          {c.email}
                        </a>
                      )}
                    </div>
                  </div>
                  {c.notes && (
                    <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{c.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-zinc-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <p className="text-center text-zinc-400 text-xs pt-4">{connections.length} connection{connections.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}

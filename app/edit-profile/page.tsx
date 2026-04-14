'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['SaaS', 'AI/ML', 'Dev Tools', 'Fintech', 'Health', 'Consumer', 'Other']
const LOCATIONS = ['Coffee Area ☕', 'Networking Zone 🤝', 'Stage Area 🎤', 'Demo Tables 🖥️', 'Entrance 🚪', 'Anywhere']
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
]

interface Founder {
  id: string
  name: string
  company: string
  tagline: string
  description: string
  website: string
  twitter: string
  category: string
  profile_photo_url: string
}

export default function EditProfilePage() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Founder | null>(null)

  useEffect(() => {
    if (!isSignedIn || !user) {
      router.push('/sign-in')
      return
    }

    async function load() {
      const { data } = await supabase.from('founders').select('*').eq('clerk_user_id', user!.id).single()
      if (data) {
        setForm(data)
      } else {
        router.push('/onboarding')
      }
      setLoading(false)
    }
    load()
  }, [user, isSignedIn, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form || !user) return
    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('founders')
      .update({
        name: form.name,
        company: form.company,
        tagline: form.tagline,
        description: form.description,
        website: form.website,
        twitter: form.twitter,
        category: form.category,
      })
      .eq('clerk_user_id', user.id)

    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      router.push('/card')
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-500">Sign in to edit your profile</p>
          <Link href="/sign-in" className="text-orange-500 font-semibold mt-4 inline-block">
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:py-12 bg-white">
      <div className="max-w-xl mx-auto">
        <Link href="/card" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm mb-8">
          <ArrowLeft size={14} /> Back to card
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">Edit Profile</h1>
          <p className="text-zinc-500 text-sm">Update your founder details, startup info, and availability</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Profile Info */}
          <div className="border-b border-zinc-100 pb-6">
            <h3 className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-widest text-zinc-600">Profile Info</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Company / Startup *</label>
                <input
                  required
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={e => setForm({ ...form, tagline: e.target.value })}
                  placeholder="What you build or what you do"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell founders about yourself, your vision, or what you're looking for..."
                  rows={4}
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="border-b border-zinc-100 pb-6">
            <h3 className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-widest text-zinc-600">Links & Contact</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Twitter / X</label>
                <input
                  value={form.twitter}
                  onChange={e => setForm({ ...form, twitter: e.target.value })}
                  placeholder="@yourhandle"
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Note about photo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Profile photo</span> is synced from your Clerk account. Update it there and it will show on your card.
            </p>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">
            {saving ? 'Saving changes...' : 'Save changes'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-zinc-500">
            Changes save instantly. Your card updates automatically. ✨
          </p>
        </div>
      </div>
    </div>
  )
}

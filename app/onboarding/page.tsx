'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['SaaS', 'AI/ML', 'Dev Tools', 'Fintech', 'Health', 'Consumer', 'Other']

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: user?.fullName || '',
    company: '',
    tagline: '',
    description: '',
    website: '',
    twitter: '',
    category: 'SaaS',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')

    // Get Clerk profile photo
    const profilePhotoUrl = user.imageUrl

    const { error } = await supabase.from('founders').upsert({
      clerk_user_id: user.id,
      profile_photo_url: profilePhotoUrl,
      ...form,
    }, { onConflict: 'clerk_user_id' })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/card')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">Add Your Profile</h1>
        <p className="text-zinc-500 text-sm mt-1">Join the YC Startup School Bangalore founder directory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
          <input
            required
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Your full name"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Company Name *</label>
          <input
            required
            value={form.company}
            onChange={e => set('company', e.target.value)}
            placeholder="Your startup name"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline <span className="text-zinc-400">(what you build, 1 line)</span></label>
          <input
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            placeholder="e.g. AI-powered analytics for D2C brands"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Tell other founders what you're working on..."
            rows={3}
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Product Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website URL</label>
          <input
            type="url"
            value={form.website}
            onChange={e => set('website', e.target.value)}
            placeholder="https://yourstartup.com"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Twitter / X Handle</label>
          <div className="flex">
            <span className="bg-zinc-100 border border-r-0 border-zinc-200 text-zinc-500 px-3 py-3 rounded-l-xl text-sm">@</span>
            <input
              value={form.twitter}
              onChange={e => set('twitter', e.target.value.replace('@', ''))}
              placeholder="yourhandle"
              className="flex-1 bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-r-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-orange-100"
        >
          {loading ? 'Saving...' : 'Add to Directory →'}
        </button>
      </form>
    </div>
  )
}

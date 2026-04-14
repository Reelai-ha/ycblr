'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['SaaS', 'AI/ML', 'Dev Tools', 'Fintech', 'Health', 'Consumer', 'Other']

export default function NewShowcasePage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    product_name: '',
    tagline: '',
    description: '',
    website: '',
    category: 'SaaS',
    logo_url: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('showcases').insert({
      clerk_user_id: user.id,
      ...form,
      upvotes: 0,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/showcase')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">Add Your Product</h1>
        <p className="text-zinc-500 text-sm mt-1">Showcase what you&apos;re building to the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Product Name *</label>
          <input
            required
            value={form.product_name}
            onChange={e => set('product_name', e.target.value)}
            placeholder="Your product name"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline</label>
          <input
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            placeholder="One line description"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="What does your product do? Who is it for?"
            rows={3}
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website URL *</label>
          <input
            required
            type="url"
            value={form.website}
            onChange={e => set('website', e.target.value)}
            placeholder="https://yourproduct.com"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Logo URL <span className="text-zinc-400">(optional)</span></label>
          <input
            type="url"
            value={form.logo_url}
            onChange={e => set('logo_url', e.target.value)}
            placeholder="https://yourproduct.com/logo.png"
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
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
          {loading ? 'Submitting...' : 'Add to Showcase →'}
        </button>
      </form>
    </div>
  )
}

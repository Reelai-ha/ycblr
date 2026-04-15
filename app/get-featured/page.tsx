'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['SaaS', 'AI/ML', 'Dev Tools', 'Fintech', 'Health', 'Consumer', 'Other']
const FEATURED_FOUNDER_URL = 'https://checkout.dodopayments.com/buy/pdt_0Nch2cGLwwjUu9scUmAgt?quantity=1&redirect_url=https://ycblr.xyz/get-featured?step=thank-you'
const FEATURED_PRODUCT_URL = 'https://checkout.dodopayments.com/buy/pdt_0Nch2cGLwwjUu9scUmAgt?quantity=1&redirect_url=https://ycblr.xyz/get-featured?step=thank-you'

function GetFeaturedContent() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get('step') || 'type'
  const type = searchParams.get('type') || 'founder' // founder or product

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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 to-white">
        <div className="text-5xl mb-4">⭐</div>
        <h1 className="text-3xl font-black text-zinc-900 mb-2 text-center">Get Featured</h1>
        <p className="text-zinc-500 text-center mb-6 max-w-md">Sign in to feature your profile or product and get seen by 200+ founders.</p>
        <Link href="/sign-in" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          Sign in →
        </Link>
      </div>
    )
  }

  // Step 1: Choose type
  if (step === 'type') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 to-white">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm mb-8">
            <ArrowLeft size={14} /> Back
          </Link>

          <div className="text-center mb-10">
            <div className="text-5xl mb-4">⭐</div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Get Featured</h1>
            <p className="text-zinc-500">Stand out from 200+ founders at YC Startup School Bangalore</p>
          </div>

          <div className="space-y-3 mb-10">
            <Link href="/get-featured?step=form&type=founder"
              className="block w-full p-6 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-black text-zinc-900 text-lg">👤 Feature Your Profile</h3>
                <span className="text-xl">→</span>
              </div>
              <p className="text-zinc-500 text-sm">Stand out in the founder directory & get more connections</p>
              <div className="mt-3 pt-3 border-t border-orange-100 space-y-1 text-xs text-zinc-600">
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Top of listings</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Featured badge ⭐</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> More visibility</div>
              </div>
            </Link>

            <Link href="/get-featured?step=form&type=product"
              className="block w-full p-6 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-black text-zinc-900 text-lg">🚀 Feature Your Product</h3>
                <span className="text-xl">→</span>
              </div>
              <p className="text-zinc-500 text-sm">Showcase your startup to 200+ founders & investors</p>
              <div className="mt-3 pt-3 border-t border-orange-100 space-y-1 text-xs text-zinc-600">
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Top of showcase</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Featured badge 🔥</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-orange-500" /> Get feedback</div>
              </div>
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5">
            <p className="text-xs text-zinc-600 text-center">
              <span className="font-semibold">1 featured slot</span> = Get seen by 200+ founders at YC Startup School Bangalore on April 18, 2026
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Fill form
  if (step === 'form') {
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      if (!user) return
      setLoading(true)
      setError('')

      const profilePhotoUrl = user.imageUrl

      if (type === 'founder') {
        const { error: err } = await supabase.from('founders').upsert({
          clerk_user_id: user.id,
          profile_photo_url: profilePhotoUrl,
          ...form,
        }, { onConflict: 'clerk_user_id' })
        if (err) {
          setError(err.message)
          setLoading(false)
        } else {
          router.push(`/get-featured?step=payment&type=founder`)
        }
      } else {
        const { error: err } = await supabase.from('showcases').insert({
          clerk_user_id: user.id,
          product_name: form.company,
          ...form,
        })
        if (err) {
          setError(err.message)
          setLoading(false)
        } else {
          router.push(`/get-featured?step=payment&type=product`)
        }
      }
    }

    return (
      <div className="min-h-screen px-4 py-12 bg-white">
        <div className="max-w-xl mx-auto">
          <Link href="/get-featured?step=type" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-sm mb-8">
            <ArrowLeft size={14} /> Back
          </Link>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-600 text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
              <Sparkles size={12} />
              Step 1 of 2
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">
              {type === 'founder' ? '👤 Feature Your Profile' : '🚀 Feature Your Product'}
            </h1>
            <p className="text-zinc-500">Fill in your details to get featured</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            {type === 'founder' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Company Name *</label>
                  <input
                    required
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Your startup name"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline <span className="text-zinc-400">(what you build, 1 line)</span></label>
                  <input
                    value={form.tagline}
                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                    placeholder="e.g. AI-powered analytics for D2C brands"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Tell other founders what you're working on..."
                    rows={3}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Product Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Twitter / X</label>
                  <input
                    value={form.twitter}
                    onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
                    placeholder="@yourhandle"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Product Name *</label>
                  <input
                    required
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Your product name"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline *</label>
                  <input
                    required
                    value={form.tagline}
                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                    placeholder="One-line description of what it does"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe your product..."
                    rows={3}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website *</label>
                  <input
                    required
                    type="url"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://yourproduct.com"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">
              {loading ? 'Saving...' : 'Continue to payment →'}
            </button>
          </form>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-xs text-zinc-600 text-center">
              <span className="font-semibold text-orange-700">Next step:</span> One-time payment to feature your {type === 'founder' ? 'profile' : 'product'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Payment
  if (step === 'payment') {
    const paymentUrl = type === 'founder' ? FEATURED_FOUNDER_URL : FEATURED_PRODUCT_URL
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 to-white">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">💳</div>
          <h1 className="text-3xl font-black text-zinc-900 mb-2">Complete Payment</h1>
          <p className="text-zinc-500 mb-8">One-time payment to feature for the entire event</p>

          <a href={paymentUrl} target="_blank" rel="noopener noreferrer"
            className="block w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-lg shadow-orange-200 mb-4">
            Pay & Get Featured
          </a>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Featured until:</p>
              <p className="font-semibold text-zinc-900">April 18, 2026</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-zinc-600">You'll be redirected back after payment ✓</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Thank you
  if (step === 'thank-you') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 to-white">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-zinc-900 mb-2">You're Featured!</h1>
          <p className="text-zinc-500 mb-8">Your {type === 'founder' ? 'profile' : 'product'} is now featured for the event</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">Top of listings</p>
                  <p className="text-xs text-zinc-500">Stand out from the crowd</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">Featured badge</p>
                  <p className="text-xs text-zinc-500">⭐ on your {type === 'founder' ? 'profile' : 'product'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">200+ founders will see you</p>
                  <p className="text-xs text-zinc-500">April 18, 2026 at YC Startup School Bangalore</p>
                </div>
              </div>
            </div>
          </div>

          <Link href={type === 'founder' ? '/card' : '/showcase'}
            className="block w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm mb-3 shadow-lg shadow-orange-200">
            View your {type === 'founder' ? 'card' : 'product'} →
          </Link>

          <Link href="/"
            className="block w-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold py-3.5 rounded-xl transition-colors text-sm">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return null
}

export default function GetFeaturedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <GetFeaturedContent />
    </Suspense>
  )
}

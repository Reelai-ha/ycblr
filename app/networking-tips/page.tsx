import Link from 'next/link'

const sections = [
  {
    icon: '📋',
    title: 'Before the Event',
    tips: [
      'Research the speakers and attendees list in advance',
      'Prepare your 30-second pitch — problem, solution, traction',
      'Charge your phone the night before',
      'Set 2–3 specific goals: who you want to meet, what you want to learn',
      'Bring a way to exchange contacts quickly (QR code to your profile works great)',
    ],
  },
  {
    icon: '🤝',
    title: 'At the Event',
    tips: [
      'Lead with curiosity, not selling — ask about their journey first',
      'Exchange contacts immediately after a good conversation, not at the end',
      'Take notes right after each conversation while it\'s fresh',
      'Quality over quantity — 5 real conversations beat 20 card exchanges',
      'Introduce people to each other — it builds goodwill fast',
    ],
  },
  {
    icon: '🎯',
    title: 'Your Pitch Framework',
    tips: [
      '🔴 Problem — What pain are you solving? Who feels it?',
      '💡 Solution — What did you build? How is it different?',
      '📈 Traction — Any users, revenue, or notable wins?',
      '🙏 Ask — What do you need? Feedback, intros, customers?',
      'Keep it under 60 seconds. Leave room for them to respond.',
    ],
  },
  {
    icon: '📬',
    title: 'Following Up',
    tips: [
      'Send your follow-up message within 24 hours of meeting',
      'Reference something specific from your conversation',
      'Be clear about the next step — don\'t leave it vague',
      'Connect on LinkedIn/Twitter AND send an email if important',
      'Use /connections here to track who you met and your notes',
    ],
  },
]

export default function NetworkingTipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">Networking Tips</h1>
        <p className="text-zinc-500 text-sm mt-1">Make the most of YC Startup School Bangalore · April 18, 2026</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {sections.map(section => (
          <div key={section.title} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="font-bold text-zinc-900 text-lg">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-500 leading-relaxed">
                  {!tip.startsWith('🔴') && !tip.startsWith('💡') && !tip.startsWith('📈') && !tip.startsWith('🙏') ? (
                    <span className="text-orange-500 mt-0.5 shrink-0">•</span>
                  ) : null}
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Connections tracker CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-zinc-900 text-lg mb-1">Track Your Connections</h3>
          <p className="text-zinc-500 text-sm">
            Use the connections tracker to save notes about everyone you meet at the event. Private, just for you.
          </p>
        </div>
        <Link
          href="/connections"
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0 shadow-lg shadow-orange-100"
        >
          Open Tracker →
        </Link>
      </div>
    </div>
  )
}

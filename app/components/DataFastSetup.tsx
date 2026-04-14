'use client'

import { useState } from 'react'
import { Copy, Check, Code as CodeIcon } from 'lucide-react'

export default function DataFastSetup() {
    const [activeTab, setActiveTab] = useState('npm')
    const [useCookieless, setUseCookieless] = useState(false)
    const [copied1, setCopied1] = useState(false)
    const [copied2, setCopied2] = useState(false)

    const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const websiteId = 'dfid_e62iErDJsMkVu7XniqC0r'

    const npmInstall = 'npm i datafast'
    const npmInit = `import { initDataFast } from 'datafast';

const datafast = await initDataFast({
  websiteId: '${websiteId}',
});`

    return (
        <div className="w-full max-w-[540px] bg-[#1c1c1c] text-[#a1a1a1] rounded-[24px] p-7 shadow-2xl border border-white/5 font-sans overflow-hidden">
            {/* Tabs */}
            <div className="bg-[#242424] p-1.5 rounded-xl flex items-center mb-7">
                <button
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'script' ? 'bg-[#3b3b3b] text-white shadow-sm' : 'hover:text-white'
                        }`}
                >
                    <CodeIcon size={16} strokeWidth={2.5} />
                    Script
                </button>
                <button
                    onClick={() => setActiveTab('npm')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'npm' ? 'bg-[#3b3b3b] text-white shadow-sm' : 'hover:text-white'
                        }`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 0v24h24V0H0zm18.597 18.597h-2.596v-8.125h-2.597v8.125H8.312V7.125h10.285v11.472z" />
                    </svg>
                    npm
                </button>
                <button
                    onClick={() => setActiveTab('shopify')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'shopify' ? 'bg-[#3b3b3b] text-white shadow-sm' : 'hover:text-white'
                        }`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#95bf47">
                        <path d="M19.349 7.425a.82.82 0 0 0-.616-.279h-4.343l-.337-1.123c-.158-.528-.48-.902-.858-1.037l-1.002-.363a1.475 1.475 0 0 0-.546-.092 1.42 1.42 0 0 0-.756.242 3.193 3.193 0 0 0-.585.503c-.22.253-.454.67-.62 1.109l-.497 1.306-3.155.45c-.443.064-.816.347-.98.749-.16.393-.11.834.135 1.168l1.458 1.986-.153.303-.544 1.258-1.63 4.28a.824.824 0 0 0 .151.787c.188.225.467.354.757.35l3.858-.046 3.633 4.54a.8.8 0 0 0 .618.305.8.8 0 0 0 .633-.312s2.618-3.41 3.553-4.63c.4-.522.56-1.106.442-1.611l-.884-3.79 1.956-2.668a.813.813 0 0 0-.083-1.076z" />
                    </svg>
                    Shopify
                </button>
                <button
                    onClick={() => setActiveTab('wordpress')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'wordpress' ? 'bg-[#3b3b3b] text-white shadow-sm' : 'hover:text-white'
                        }`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm11.233 11.545c-.015.263-.038.525-.069.784L17.75 22.316C21.171 20.375 23.514 16.716 23.953 12.5a5.495 5.495 0 0 1-2.72.39zM8.336 22.18l-3.32-9.052A12.001 12.001 0 0 1 12 2.308c1.378 0 2.684.232 3.903.655l-3.413 11.082l-4.154 8.135zM2.384 7.641a9.692 9.692 0 0 1 1.637-2.603l5.053 13.844-6.69-11.241zM12 21.692a9.615 9.615 0 0 1-1.03-.056l3.524-6.918 3.52 9.616A9.692 9.692 0 0 1 12 21.692z" />
                    </svg>
                    WordPress
                </button>
            </div>

            <p className="text-[#a1a1a1] text-[14.5px] leading-[1.5] mb-6 font-medium">
                Install the DataFast package and initialize it with your website ID. Use in React, Next.js, or any JavaScript app. See our <a href="#" className="underline decoration-orange-500/50 hover:decoration-orange-500 text-[#f27e5a] font-semibold transition-all">npm docs</a> for details.
            </p>

            {/* Toggle */}
            <div className="flex items-center gap-2.5 mb-8">
                <button
                    onClick={() => setUseCookieless(!useCookieless)}
                    className={`w-[19px] h-[19px] rounded-[4px] border flex items-center justify-center transition-all ${useCookieless ? 'bg-[#3b3b3b] border-[#555555]' : 'bg-[#292929] border-[#3b3b3b]'
                        }`}
                >
                    {useCookieless && <Check size={12} strokeWidth={3} className="text-white" />}
                </button>
                <span className="text-[14.5px] font-semibold text-[#f1f1f1] tracking-tight">Use cookieless tracking script</span>
                <div className="flex items-center justify-center ml-0.5 w-[20px] h-[14px]">
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                        <rect width="20" height="14" rx="2" fill="#003399" />
                        <circle cx="10" cy="7" r="4" stroke="#FFCC00" strokeWidth="0.5" strokeDasharray="1 1.5" />
                        <path d="M10 5L10.3 6.3H11.6L10.5 7.1L10.9 8.4L10 7.6L9.1 8.4L9.5 7.1L8.4 6.3H9.7L10 5Z" fill="#FFCC00" />
                    </svg>
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-8">
                <div>
                    <h3 className="text-[13px] font-bold text-[#f1f1f1] mb-2.5 opacity-60">1. Install the package</h3>
                    <div className="bg-[#121212] rounded-[16px] p-5 relative group border border-white/[0.03]">
                        <code className="text-[#f1f1f1] font-mono text-[14px] tracking-tight">
                            npm i datafast
                        </code>
                        <button
                            onClick={() => copyToClipboard(npmInstall, setCopied1)}
                            className="absolute top-1/2 -translate-y-1/2 right-4 p-2.5 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] text-[#a1a1a1] hover:text-white transition-all border border-white/[0.03]"
                        >
                            {copied1 ? <Check size={18} className="text-[#f27e5a]" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-[13px] font-bold text-[#f1f1f1] mb-2.5 opacity-60">2. Initialize with your website ID</h3>
                    <div className="bg-[#121212] rounded-[16px] p-5 pb-7 relative group border border-white/[0.03]">
                        <pre className="text-[14px] font-mono leading-[1.6] overflow-x-auto text-[#f1f1f1]">
                            <span className="text-[#c678dd]">import</span> {'{'} <span className="">initDataFast</span> {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">&apos;datafast&apos;</span><span className="">;</span>
                            <br /><br />
                            <span className="text-[#c678dd]">const</span> <span className="">datafast</span> = <span className="text-[#c678dd]">await</span> <span className="">initDataFast</span><span className="">(</span>{'{'}
                            <br />
                            &nbsp;&nbsp;<span className="">websiteId:</span> <span className="text-[#98c379]">&apos;{websiteId}&apos;</span><span className="">,</span>
                            <br />
                            {'}'}<span className="">)</span><span className="">;</span>
                        </pre>
                        <button
                            onClick={() => copyToClipboard(npmInit, setCopied2)}
                            className="absolute top-5 right-4 p-2.5 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] text-[#a1a1a1] hover:text-white transition-all border border-white/[0.03]"
                        >
                            {copied2 ? <Check size={18} className="text-[#f27e5a]" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Button */}
            <button className="w-full bg-[#ef6d43] hover:bg-[#f27e5a] text-white font-black py-4.5 rounded-2xl shadow-[0_8px_32px_rgba(239,109,67,0.35)] transition-all flex items-center justify-center gap-2.5 text-[15.5px] border-t border-white/20 active:scale-[0.98]">
                Done, show me next steps
                <span className="text-[20px] leading-none">→</span>
            </button>
        </div>
    )
}

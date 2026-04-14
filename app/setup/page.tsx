'use client'

import DataFastSetup from '@/app/components/DataFastSetup'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
                <Link href="/" className="text-zinc-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} />
                    Back to directory
                </Link>
                <div className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-xs font-semibold text-zinc-400">
                    SETUP GUIDE
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DataFastSetup />
            </div>

            <p className="mt-8 text-zinc-600 text-xs lowercase tracking-widest font-black italic">
                Powered by DataFast Analytics
            </p>
        </div>
    )
}

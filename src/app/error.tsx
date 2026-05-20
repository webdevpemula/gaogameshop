'use client'
// src/app/error.tsx

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080b11]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Terjadi Kesalahan</h1>
        <p className="text-white/40 text-sm mb-2 leading-relaxed">
          Ada sesuatu yang tidak beres. Coba muat ulang halaman atau kembali ke beranda.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-red-400/60 text-xs mb-6 font-mono bg-red-500/5 px-3 py-2 rounded-lg">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] transition-all">
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 font-medium border border-white/10 hover:bg-white/10 transition-all">
            <Home className="w-4 h-4" /> Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

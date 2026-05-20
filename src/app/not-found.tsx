'use client'
// src/app/not-found.tsx

import Link from 'next/link'
import { Gamepad2, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080b11]">
      <div className="text-center max-w-md">
        {/* Glitch 404 */}
        <div className="relative mb-8">
          <p className="font-display font-bold text-[120px] leading-none text-white/5 select-none">404</p>
          <p className="font-display font-bold text-6xl text-[var(--gold)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glow-gold-text">
            404
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mx-auto mb-6">
          <Gamepad2 className="w-8 h-8 text-[var(--gold)]" />
        </div>

        <h1 className="font-display font-bold text-3xl text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk kembali ke beranda!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] transition-all">
            <Home className="w-4 h-4" /> Ke Beranda
          </Link>
          <button onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 font-medium border border-white/10 hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      </div>
    </div>
  )
}

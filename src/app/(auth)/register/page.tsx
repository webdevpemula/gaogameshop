'use client'
// src/app/(auth)/register/page.tsx

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gamepad2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080b11]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold)] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#080b11]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold">
              <span className="text-[var(--gold)]">GAO</span>
              <span className="text-white">GAME</span>
              <span className="text-white/40">SHOP</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mt-6 mb-2">Daftar Akun</h1>
          <p className="text-white/40 text-sm">Gratis, proses cepat!</p>
        </div>

        {success ? (
          <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-green-400 font-medium">Pendaftaran berhasil! 🎉</p>
            <p className="text-green-400/60 text-sm mt-1">Mengalihkan ke halaman login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Nama Lengkap</label>
              <input type="text" placeholder="Nama lengkap kamu"
                value={fullName} onChange={e => setFullName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Email</label>
              <input type="email" placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 karakter"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-xs px-1">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-lg hover:bg-[var(--gold-dim)] disabled:opacity-60 transition-all">
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-white/40 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[var(--gold)] hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}

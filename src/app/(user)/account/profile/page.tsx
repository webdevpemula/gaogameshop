'use client'
// src/app/(user)/account/profile/page.tsx

import { useState, useEffect } from 'react'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'

export default function ProfilePage() {
  const { user, profile } = useUser()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [savedPass, setSavedPass] = useState(false)
  const [errorPass, setErrorPass] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', user!.id)
    if (error) setError(error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPass('')
    if (newPassword !== confirmPassword) {
      setErrorPass('Password baru tidak cocok')
      return
    }
    if (newPassword.length < 6) {
      setErrorPass('Password minimal 6 karakter')
      return
    }
    setSavingPass(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setErrorPass(error.message)
    else {
      setSavedPass(true)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => setSavedPass(false), 3000)
    }
    setSavingPass(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-4xl text-white mb-8">Profil Saya</h1>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-[#141821] border border-white/5 mb-5 space-y-4">
        <h3 className="font-display font-bold text-white text-lg">Data Diri</h3>

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Email</label>
          <input type="email" value={user?.email ?? ''} disabled
            className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white/30 text-sm cursor-not-allowed" />
          <p className="text-xs text-white/20 mt-1">Email tidak bisa diubah</p>
        </div>

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Nama Lengkap</label>
          <input type="text" placeholder="Nama lengkap kamu"
            value={fullName} onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
          />
        </div>

        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Nomor HP</label>
          <input type="tel" placeholder="08xxxxxxxxxx"
            value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Profil berhasil disimpan!
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] disabled:opacity-60 transition-all">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>

      {/* Password Form */}
      <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-[#141821] border border-white/5 space-y-4">
        <h3 className="font-display font-bold text-white text-lg">Ganti Password</h3>

        {[
          { label: 'Password Baru', value: newPassword, setter: setNewPassword },
          { label: 'Konfirmasi Password Baru', value: confirmPassword, setter: setConfirmPassword },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="text-xs text-white/40 mb-1.5 block">{label}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={value} onChange={e => setter(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {errorPass && <p className="text-red-400 text-xs">{errorPass}</p>}
        {savedPass && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Password berhasil diubah!
          </div>
        )}

        <button type="submit" disabled={savingPass}
          className="w-full py-3 rounded-xl bg-white/5 text-white font-display font-bold border border-white/10 hover:bg-white/10 disabled:opacity-60 transition-all">
          {savingPass ? 'Mengubah...' : 'Ganti Password'}
        </button>
      </form>
    </div>
  )
}


'use client'
// src/app/(admin)/admin/users/page.tsx

import { useEffect, useState } from 'react'
import { Search, Shield, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { Profile } from '@/types/database'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('full_name', `%${search}%`)
    const { data } = await query.limit(50)
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [search])

  const handleToggleRole = async (userId: string, currentRole: string) => {
    if (!confirm(`Ubah role user ini menjadi ${currentRole === 'admin' ? 'customer' : 'admin'}?`)) return
    const supabase = createClient()
    await supabase.from('profiles')
      .update({ role: currentRole === 'admin' ? 'customer' : 'admin' })
      .eq('id', userId)
    fetchUsers()
  }

  const handleTopupSaldo = async (userId: string) => {
    const amount = prompt('Masukkan nominal top up saldo (Rp):')
    if (!amount || isNaN(Number(amount))) return
    const supabase = createClient()
    const { data: profile } = await supabase.from('profiles').select('saldo').eq('id', userId).single()
    if (!profile) return
    const newSaldo = profile.saldo + parseInt(amount)
    await supabase.from('profiles').update({ saldo: newSaldo }).eq('id', userId)
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'topup',
      amount: parseInt(amount),
      balance_before: profile.saldo,
      balance_after: newSaldo,
      description: 'Top up manual oleh admin',
      status: 'success',
    })
    fetchUsers()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-white">Pengguna</h1>
        <p className="text-white/40 text-sm mt-1">{users.length} pengguna terdaftar</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" placeholder="Cari nama pengguna..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Pengguna', 'Role', 'Saldo', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 rounded animate-shimmer w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">Tidak ada pengguna</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#080b11] text-xs font-bold flex-shrink-0">
                          {user.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.full_name ?? '—'}</p>
                          <p className="text-xs text-white/30">{user.phone ?? 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1.5 w-fit text-xs px-2.5 py-1 rounded-lg font-medium ${
                        user.role === 'admin'
                          ? 'bg-[rgba(245,166,35,0.1)] text-[var(--gold)]'
                          : 'bg-white/5 text-white/40'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-display font-bold text-[var(--gold)]">{formatCurrency(user.saldo)}</td>
                    <td className="px-5 py-3 text-sm text-white/40">{formatDateShort(user.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleTopupSaldo(user.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-[rgba(245,166,35,0.1)] text-[var(--gold)] hover:bg-[rgba(245,166,35,0.2)] transition-all font-medium">
                          Top Up
                        </button>
                        <button onClick={() => handleToggleRole(user.id, user.role)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all font-medium">
                          {user.role === 'admin' ? '→ Customer' : '→ Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


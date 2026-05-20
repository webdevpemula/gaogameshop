'use client'
// src/app/(user)/account/complaints/page.tsx

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageCircle, Plus, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { formatDate } from '@/lib/utils'
import type { Complaint } from '@/types/database'

const statusConfig = {
  open:        { label: 'Menunggu',    color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  in_progress: { label: 'Diproses',   color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  resolved:    { label: 'Selesai',    color: 'text-green-400',  bg: 'bg-green-400/10' },
  closed:      { label: 'Ditutup',    color: 'text-white/30',   bg: 'bg-white/5' },
}

import { Suspense } from 'react'

function ComplaintsContent() {
  const searchParams = useSearchParams()
  const { user } = useUser()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    message: '',
    order_id: searchParams.get('order_id') ?? '',
  })

  const fetchComplaints = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
    setComplaints(data ?? [])
    setLoading(false)
  }

  useEffect(() => { if (user) fetchComplaints() }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('complaints').insert({
      user_id: user.id,
      subject: form.subject,
      message: form.message,
      order_id: form.order_id || null,
    })
    if (!error) {
      setSuccess(true)
      setShowForm(false)
      setForm({ subject: '', message: '', order_id: '' })
      fetchComplaints()
      setTimeout(() => setSuccess(false), 3000)
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-4xl text-white">Pengaduan</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-sm hover:bg-[var(--gold-dim)] transition-all">
          {showForm ? <><X className="w-4 h-4" /> Batal</> : <><Plus className="w-4 h-4" /> Buat Pengaduan</>}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400 text-sm">Pengaduan berhasil dikirim! Tim kami akan segera merespons.</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#141821] border border-[rgba(245,166,35,0.2)] mb-6 space-y-4">
          <h3 className="font-display font-bold text-white">Buat Pengaduan Baru</h3>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Nomor Order <span className="text-white/20">(opsional)</span></label>
            <input type="text" placeholder="Contoh: GAO-20250101-XXXX"
              value={form.order_id}
              onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Subjek <span className="text-red-400">*</span></label>
            <input type="text" placeholder="Contoh: Diamond tidak masuk setelah pembayaran"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Pesan <span className="text-red-400">*</span></label>
            <textarea
              placeholder="Ceritakan masalah yang kamu alami secara detail..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all resize-none"
            />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] disabled:opacity-60 transition-all">
            {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#141821] border border-white/5">
          <MessageCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Belum ada pengaduan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => {
            const cfg = statusConfig[c.status as keyof typeof statusConfig] ?? statusConfig.open
            return (
              <div key={c.id} className="p-5 rounded-2xl bg-[#141821] border border-white/5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-display font-semibold text-white">{c.subject}</p>
                  <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} font-medium`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-white/40 mb-3 line-clamp-2">{c.message}</p>
                {c.admin_reply && (
                  <div className="p-3 rounded-xl bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.1)] mb-3">
                    <p className="text-xs text-[var(--gold)] font-medium mb-1">Balasan Admin</p>
                    <p className="text-sm text-white/70">{c.admin_reply}</p>
                  </div>
                )}
                <p className="text-xs text-white/20">{formatDate(c.created_at)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default function ComplaintsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white/40">Memuat...</div>}>
      <ComplaintsContent />
    </Suspense>
  )
}

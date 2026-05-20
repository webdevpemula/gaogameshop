'use client'
// src/app/(user)/account/orders/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Clock, CheckCircle, XCircle, Package, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/types/database'

const statusConfig = {
  pending:    { label: 'Menunggu Pembayaran', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  paid:       { label: 'Sudah Dibayar',       color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: CheckCircle },
  processing: { label: 'Sedang Diproses',     color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Package },
  shipped:    { label: 'Dikirim',             color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   icon: Package },
  completed:  { label: 'Selesai',             color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle },
  cancelled:  { label: 'Dibatalkan',          color: 'text-red-400',    bg: 'bg-red-400/10',    icon: XCircle },
}

const filters = ['Semua', 'Menunggu', 'Diproses', 'Selesai', 'Dibatalkan']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Semua')

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

      if (activeFilter === 'Menunggu') query = query.in('status', ['pending'])
      else if (activeFilter === 'Diproses') query = query.in('status', ['paid', 'processing', 'shipped'])
      else if (activeFilter === 'Selesai') query = query.eq('status', 'completed')
      else if (activeFilter === 'Dibatalkan') query = query.eq('status', 'cancelled')

      const { data } = await query
      setOrders(data ?? [])
      setLoading(false)
    }
    fetchOrders()
  }, [activeFilter])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-4xl text-white mb-6">Pesanan Saya</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-display font-semibold transition-all ${
              activeFilter === f
                ? 'bg-[var(--gold)] text-[#080b11]'
                : 'bg-[#141821] text-white/50 border border-white/5 hover:text-white'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#141821] border border-white/5">
          <ShoppingBag className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Tidak ada pesanan</p>
          <Link href="/products" className="mt-3 inline-block text-sm text-[var(--gold)] hover:underline">Mulai belanja</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const cfg = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
            const StatusIcon = cfg.icon
            return (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="block p-5 rounded-2xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.2)] transition-all group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-display font-bold text-white">{order.order_number}</p>
                    <p className="text-xs text-white/30 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} flex-shrink-0`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-sm">
                    Total: <span className="text-[var(--gold)] font-display font-bold">{formatCurrency(order.total)}</span>
                  </p>
                  <span className="flex items-center gap-1 text-xs text-white/30 group-hover:text-[var(--gold)] transition-colors">
                    Detail <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

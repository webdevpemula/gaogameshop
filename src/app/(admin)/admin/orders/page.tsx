'use client'
// src/app/(admin)/admin/orders/page.tsx

import { useEffect, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/types/database'

// 1. Definisikan tipe union khusus untuk status pesanan sesuai database Supabase
type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const statusOptions: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled']
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Menunggu',   color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  paid:       { label: 'Dibayar',    color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  processing: { label: 'Diproses',   color: 'text-purple-400', bg: 'bg-purple-400/10' },
  shipped:    { label: 'Dikirim',    color: 'text-cyan-400',   bg: 'bg-cyan-400/10' },
  completed:  { label: 'Selesai',    color: 'text-green-400',  bg: 'bg-green-400/10' },
  cancelled:  { label: 'Dibatalkan', color: 'text-red-400',    bg: 'bg-red-400/10' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // 2. Berikan tipe pada state filter
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    
    // 3. Beri jaminan tipe (as OrderStatus) saat melakukan filter query
    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus as OrderStatus)
    }
    
    if (search) query = query.ilike('order_number', `%${search}%`)
    const { data } = await query.limit(50)
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300)
    return () => clearTimeout(t)
  }, [search, filterStatus])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    const supabase = createClient()
    
    // 4. Beri jaminan tipe (as OrderStatus) saat melakukan update ke database
    await supabase.from('orders').update({ 
      status: newStatus as OrderStatus 
    }).eq('id', orderId)
    
    await fetchOrders()
    setUpdatingId(null)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-white">Pesanan</h1>
        <p className="text-white/40 text-sm mt-1">{orders.length} pesanan ditemukan</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Cari nomor order..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...statusOptions].map(s => {
            const cfg = statusConfig[s]
            return (
              <button key={s} onClick={() => setFilterStatus(s as OrderStatus | 'all')}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-[var(--gold)] text-[#080b11] font-bold'
                    : 'bg-[#141821] text-white/50 border border-white/5 hover:text-white'
                }`}>
                {s === 'all' ? 'Semua' : cfg?.label ?? s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['No. Order', 'Tanggal', 'Total', 'Metode', 'ID Game', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/30 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 rounded animate-shimmer w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-white/30 text-sm">Tidak ada pesanan</td></tr>
              ) : (
                orders.map(order => {
                  const cfg = statusConfig[order.status] ?? statusConfig.pending
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                      <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{order.order_number}</td>
                      <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 text-sm font-display font-bold text-[var(--gold)] whitespace-nowrap">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3 text-xs text-white/50 capitalize">{order.payment_method ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-white/50">{order.game_target_id ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} font-medium whitespace-nowrap`}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[#1a2030] border border-white/10 text-white text-xs focus:outline-none focus:border-[rgba(245,166,35,0.4)] disabled:opacity-50 cursor-pointer transition-all"
                          >
                            {statusOptions.map(s => (
                              <option key={s} value={s}>{statusConfig[s]?.label ?? s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
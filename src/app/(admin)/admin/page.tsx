'use client'
// src/app/(admin)/admin/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Users, CreditCard, TrendingUp, Clock, CheckCircle, XCircle, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/types/database'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Menunggu',  color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  paid:       { label: 'Dibayar',   color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  processing: { label: 'Diproses',  color: 'text-purple-400', bg: 'bg-purple-400/10' },
  shipped:    { label: 'Dikirim',   color: 'text-cyan-400',   bg: 'bg-cyan-400/10' },
  completed:  { label: 'Selesai',   color: 'text-green-400',  bg: 'bg-green-400/10' },
  cancelled:  { label: 'Dibatalkan',color: 'text-red-400',    bg: 'bg-red-400/10' },
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, users: 0, revenue: 0, products: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [
        { count: orderCount },
        { count: userCount },
        { count: productCount },
        { data: orders },
        { data: revenueData },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
      ])

      const revenue = (revenueData ?? []).reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        orders: orderCount ?? 0,
        users: userCount ?? 0,
        revenue,
        products: productCount ?? 0,
      })
      setRecentOrders((orders as Order[]) ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: TrendingUp, color: 'text-[var(--gold)]', bg: 'bg-[rgba(245,166,35,0.1)]' },
    { label: 'Total Order', value: String(stats.orders), icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total User', value: String(stats.users), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Produk Aktif', value: String(stats.products), icon: Package, color: 'text-green-400', bg: 'bg-green-400/10' },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Selamat datang di panel admin GaoGameShop</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="p-5 rounded-2xl bg-[#141821] border border-white/5">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            {loading
              ? <div className="h-7 w-24 rounded animate-shimmer mb-1" />
              : <p className={`font-display font-bold text-2xl ${card.color}`}>{card.value}</p>
            }
            <p className="text-xs text-white/40 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display font-bold text-white">Order Terbaru</h2>
          <Link href="/admin/orders" className="text-xs text-[var(--gold)] hover:underline">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['No. Order', 'Tanggal', 'Total', 'Metode', 'Status'].map(h => (
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
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">Belum ada order</td></tr>
              ) : (
                recentOrders.map(order => {
                  const cfg = statusConfig[order.status] ?? statusConfig.pending
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                      <td className="px-5 py-3">
                        <Link href={`/admin/orders`} className="text-sm font-medium text-white hover:text-[var(--gold)] transition-colors">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-white/40">{formatDate(order.created_at)}</td>
                      <td className="px-5 py-3 text-sm font-display font-bold text-[var(--gold)]">{formatCurrency(order.total)}</td>
                      <td className="px-5 py-3 text-sm text-white/50 capitalize">{order.payment_method ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} font-medium`}>{cfg.label}</span>
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
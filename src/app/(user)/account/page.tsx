'use client'
// src/app/(user)/account/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Wallet, MessageCircle, User, ArrowRight, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { Order } from '@/types/database'

const statusConfig = {
  pending:    { label: 'Menunggu',  color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  paid:       { label: 'Dibayar',   color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: CheckCircle },
  processing: { label: 'Diproses',  color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Package },
  shipped:    { label: 'Dikirim',   color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   icon: Package },
  completed:  { label: 'Selesai',   color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle },
  cancelled:  { label: 'Dibatalkan',color: 'text-red-400',    bg: 'bg-red-400/10',    icon: XCircle },
}

export default function AccountPage() {
  const { user, profile, loading } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      setOrders(data ?? [])
      setOrdersLoading(false)
    }
    if (user) fetchOrders()
  }, [user])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] flex items-center justify-center text-[#080b11] font-display font-bold text-2xl flex-shrink-0">
          {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">{profile?.full_name ?? 'User'}</h1>
          <p className="text-white/40 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Order', value: String(orders.length), icon: ShoppingBag, href: '/account/orders', color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Saldo', value: formatCurrency(profile?.saldo ?? 0), icon: Wallet, href: '/account/wallet', color: 'text-[var(--gold)]', bg: 'bg-[rgba(245,166,35,0.1)]' },
          { label: 'Pengaduan', value: 'Lihat', icon: MessageCircle, href: '/account/complaints', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="group p-4 rounded-2xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.2)] transition-all">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`font-display font-bold text-lg ${stat.color} truncate`}>{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label: 'Pesanan Saya', desc: 'Lihat riwayat & status order', href: '/account/orders', icon: ShoppingBag },
          { label: 'Dompet', desc: 'Top up & riwayat transaksi', href: '/account/wallet', icon: Wallet },
          { label: 'Pengaduan', desc: 'Laporkan masalah pesanan', href: '/account/complaints', icon: MessageCircle },
          { label: 'Profil', desc: 'Edit data diri & password', href: '/account/profile', icon: User },
        ].map(item => (
          <Link key={item.label} href={item.href}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-white text-sm">{item.label}</p>
              <p className="text-xs text-white/30 truncate">{item.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[var(--gold)] transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-lg">Order Terbaru</h2>
          <Link href="/account/orders" className="text-sm text-[var(--gold)] hover:underline">Lihat Semua</Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-shimmer" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-[#141821] border border-white/5">
            <ShoppingBag className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/30 text-sm">Belum ada pesanan</p>
            <Link href="/products" className="mt-3 inline-block text-xs text-[var(--gold)] hover:underline">Mulai belanja</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map(order => {
              const cfg = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending
              const StatusIcon = cfg.icon
              return (
                <Link key={order.id} href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.2)] transition-all">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{order.order_number}</p>
                    <p className="text-xs text-white/30">{formatDateShort(order.created_at)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-display font-bold text-[var(--gold)]">{formatCurrency(order.total)}</p>
                    <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

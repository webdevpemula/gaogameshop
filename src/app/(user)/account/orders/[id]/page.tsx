'use client'
// src/app/(user)/account/orders/[id]/page.tsx

import { useEffect, useState, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, Truck, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, OrderItem } from '@/types/database'

const timeline = [
  { status: 'pending',     label: 'Order Dibuat',         icon: Clock },
  { status: 'paid',       label: 'Pembayaran Diterima',  icon: CheckCircle },
  { status: 'processing', label: 'Sedang Diproses',      icon: Package },
  { status: 'shipped',    label: 'Sedang Dikirim',       icon: Truck },
  { status: 'completed',  label: 'Pesanan Selesai',      icon: Star },
]

const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'completed']

function OrderDetailContent() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Amankan variabel id agar dipastikan berupa string tunggal dan bukan undefined/array
    if (!id) return;
    const safeId = Array.isArray(id) ? id[0] : id;

    const fetchOrder = async () => {
      const supabase = createClient()
      const [{ data: orderData }, { data: itemsData }] = await Promise.all([
        supabase.from('orders').select('*').eq('id', safeId).single(),
        supabase.from('order_items').select('*').eq('order_id', safeId),
      ])
      setOrder(orderData as Order | null)
      setItems((itemsData as OrderItem[]) ?? [])
      setLoading(false)
    }
    fetchOrder()
  }, [id])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
    </div>
  )

  if (!order) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-white/40">Order tidak ditemukan</p>
      <Link href="/account/orders" className="mt-4 inline-block text-[var(--gold)] hover:underline text-sm">Kembali</Link>
    </div>
  )

  const isCancelled = order.status === 'cancelled'
  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/account/orders" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Pesanan Saya
      </Link>

      <h1 className="font-display font-bold text-3xl text-white mb-1">{order.order_number}</h1>
      <p className="text-white/30 text-sm mb-8">{formatDate(order.created_at)}</p>

      {/* Timeline Tracking */}
      {!isCancelled ? (
        <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 mb-6">
          <h3 className="font-display font-bold text-white mb-5">Status Pesanan</h3>
          <div className="relative">
            {timeline.map((step, i) => {
              const isCompleted = currentStatusIndex >= i
              const isCurrent = currentStatusIndex === i
              const Icon = step.icon
              return (
                <div key={step.status} className="flex gap-4 pb-5 last:pb-0">
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                      isCurrent ? 'bg-[var(--gold)] ring-4 ring-[rgba(245,166,35,0.2)]'
                      : isCompleted ? 'bg-green-500'
                      : 'bg-[#1a2030] border border-white/10'
                    }`}>
                      <Icon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-white/20'}`} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${isCompleted && currentStatusIndex > i ? 'bg-green-500/50' : 'bg-white/5'}`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pt-1.5">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-white/30'}`}>{step.label}</p>
                    {isCurrent && <p className="text-xs text-[var(--gold)] mt-0.5">Status saat ini</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium text-sm">Pesanan Dibatalkan</p>
            <p className="text-red-400/60 text-xs mt-0.5">Pesanan ini telah dibatalkan</p>
          </div>
        </div>
      )}

      {/* Order Info */}
      <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 mb-4">
        <h3 className="font-display font-bold text-white mb-4">Info Pesanan</h3>
        <div className="space-y-2.5">
          {[
            { label: 'Nomor Order', value: order.order_number },
            { label: 'Metode Bayar', value: order.payment_method === 'saldo' ? 'Saldo GaoGameShop' : 'Midtrans' },
            { label: 'Status Bayar', value: order.payment_status === 'paid' ? '✅ Lunas' : '⏳ Belum Lunas' },
            ...(order.game_target_id ? [{ label: 'ID Game', value: order.game_target_id }] : []),
            ...(order.game_target_server ? [{ label: 'Server', value: order.game_target_server }] : []),
            ...(order.notes ? [{ label: 'Catatan', value: order.notes }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="text-white/40 flex-shrink-0">{label}</span>
              <span className="text-white text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 mb-4">
        <h3 className="font-display font-bold text-white mb-4">Item Pesanan</h3>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1a2030] flex-shrink-0 overflow-hidden">
                {item.product_image
                  ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">IMG</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.product_name}</p>
                <p className="text-xs text-white/30">×{item.qty}</p>
              </div>
              <p className="text-sm font-display font-bold text-[var(--gold)] flex-shrink-0">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-4 pt-4 flex justify-between">
          <span className="font-display font-bold text-white">Total</span>
          <span className="font-display font-bold text-[var(--gold)] text-xl">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === 'completed' && (
          <Link href={`/account/complaints?order_id=${order.id}`}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-sm font-medium text-center hover:bg-white/10 transition-all">
            Ajukan Pengaduan
          </Link>
        )}
        <Link href="/products"
          className="flex-1 py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-sm text-center hover:bg-[var(--gold-dim)] transition-all">
          Beli Lagi
        </Link>
      </div>
    </div>
  )
}

// 2. Bungkus isi halaman dengan Suspense Boundary agar lulus kompilasi Next.js
export default function OrderDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-shimmer" />)}
      </div>
    }>
      <OrderDetailContent />
    </Suspense>
  )
}
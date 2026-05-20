'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CheckCircle, Clock, XCircle, ArrowRight, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/types/database'

// Komponen konten utama
function PaymentStatusContent() {
  const { orderId } = useParams()
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    const safeOrderId = Array.isArray(orderId) ? orderId[0] : orderId

    const fetchOrder = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('orders').select('*').eq('id', safeOrderId).single()
      setOrder(data as Order | null)
      setLoading(false)
    }

    fetchOrder()
    const interval = setInterval(fetchOrder, 3000)
    return () => clearInterval(interval)
  }, [orderId])

  const isPaid = order?.payment_status === 'paid' || status === 'success'
  const isFailed = order?.payment_status === 'failed' || status === 'error'

  if (loading) return <div className="p-8 text-center text-white">Memuat...</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPaid ? 'bg-green-500/10' : isFailed ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
        {isPaid ? <CheckCircle className="w-10 h-10 text-green-400" /> : isFailed ? <XCircle className="w-10 h-10 text-red-400" /> : <Clock className="w-10 h-10 text-yellow-400" />}
      </div>
      <h1 className="font-display font-bold text-3xl text-white mb-2">
        {isPaid ? 'Pembayaran Berhasil!' : isFailed ? 'Pembayaran Gagal' : 'Menunggu Pembayaran'}
      </h1>
      {order && (
        <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 text-left mb-6">
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-white/40">Nomor Order</span><span className="text-white font-medium">{order.order_number}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Total</span><span className="text-white font-medium">{formatCurrency(order.total)}</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Bungkus dengan dynamic agar benar-benar aman dari SSR
const DynamicPaymentContent = dynamic(() => Promise.resolve(PaymentStatusContent), { ssr: false })

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Memuat...</div>}>
      <DynamicPaymentContent />
    </Suspense>
  )
}
'use client'
// src/app/(store)/checkout/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wallet, CreditCard, Gamepad2, ChevronRight, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useUser } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/utils'

declare global {
  interface Window { snap: any }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user, profile, loading } = useUser()
  const [paymentMethod, setPaymentMethod] = useState<'saldo' | 'midtrans'>('midtrans')
  const [gameTargetId, setGameTargetId] = useState('')
  const [gameTargetServer, setGameTargetServer] = useState('')
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const total = totalPrice()
  const hasTopupItem = items.some(i => i.product_type === 'topup')
  const saldoCukup = (profile?.saldo ?? 0) >= total

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script')
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/checkout')
    if (!loading && items.length === 0) router.push('/cart')
  }, [user, loading, items, router])

  const handleCheckout = async () => {
    setError('')
    if (hasTopupItem && !gameTargetId) {
      setError('Masukkan ID game kamu terlebih dahulu')
      return
    }

    setProcessing(true)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image_url: i.image_url, product_type: i.product_type })),
          payment_method: paymentMethod,
          game_target_id: gameTargetId,
          game_target_server: gameTargetServer,
          notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memproses pembayaran')

      clearCart()

      if (data.payment_method === 'saldo') {
        router.push(`/payment/${data.order_id}?status=success`)
        return
      }

      // Buka Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(data.snap_token, {
          onSuccess: () => router.push(`/payment/${data.order_id}?status=success`),
          onPending: () => router.push(`/payment/${data.order_id}?status=pending`),
          onError: () => router.push(`/payment/${data.order_id}?status=error`),
          onClose: () => {
            setProcessing(false)
            router.push(`/payment/${data.order_id}`)
          },
        })
      } else {
        window.location.href = data.redirect_url
      }
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (loading || items.length === 0) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-4xl text-white">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">

          {/* Game Target ID (untuk produk top up) */}
          {hasTopupItem && (
            <div className="p-5 rounded-2xl bg-[#141821] border border-[rgba(245,166,35,0.2)]">
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="w-4 h-4 text-[var(--gold)]" />
                <h3 className="font-display font-bold text-white">Data Akun Game</h3>
                <span className="text-red-400 text-xs">*Wajib</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">ID Akun / User ID</label>
                  <input
                    type="text"
                    placeholder="Contoh: 123456789"
                    value={gameTargetId}
                    onChange={e => setGameTargetId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Server / Zone ID <span className="text-white/20">(jika ada)</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: 1234 (ID Server ML)"
                    value={gameTargetServer}
                    onChange={e => setGameTargetServer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Metode Pembayaran */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/5">
            <h3 className="font-display font-bold text-white mb-4">Metode Pembayaran</h3>
            <div className="space-y-3">

              {/* Saldo */}
              <button
                onClick={() => setPaymentMethod('saldo')}
                disabled={!saldoCukup}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  paymentMethod === 'saldo'
                    ? 'border-[var(--gold)] bg-[rgba(245,166,35,0.08)]'
                    : 'border-white/5 hover:border-white/15'
                } ${!saldoCukup ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'saldo' ? 'border-[var(--gold)]' : 'border-white/20'
                }`}>
                  {paymentMethod === 'saldo' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />}
                </div>
                <Wallet className="w-5 h-5 text-[var(--gold)]" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-white text-sm">Saldo GaoGameShop</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Saldo: {formatCurrency(profile?.saldo ?? 0)}
                    {!saldoCukup && <span className="text-red-400 ml-2">— Tidak mencukupi</span>}
                  </p>
                </div>
              </button>

              {/* Midtrans */}
              <button
                onClick={() => setPaymentMethod('midtrans')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  paymentMethod === 'midtrans'
                    ? 'border-[var(--gold)] bg-[rgba(245,166,35,0.08)]'
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'midtrans' ? 'border-[var(--gold)]' : 'border-white/20'
                }`}>
                  {paymentMethod === 'midtrans' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />}
                </div>
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-white text-sm">Transfer / QRIS / VA</p>
                  <p className="text-xs text-white/40 mt-0.5">Powered by Midtrans</p>
                </div>
                <div className="flex gap-1">
                  {['BCA', 'BNI', 'QRIS'].map(b => (
                    <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{b}</span>
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* Catatan */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/5">
            <h3 className="font-display font-bold text-white mb-3">Catatan <span className="text-white/30 font-normal text-sm">(opsional)</span></h3>
            <textarea
              placeholder="Catatan tambahan untuk pesanan ini..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a2030] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.3)] transition-all resize-none"
            />
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 sticky top-24">
            <h3 className="font-display font-bold text-white text-lg mb-4">Ringkasan Order</h3>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto scrollbar-hide">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/40 truncate flex-1">{item.name} ×{item.qty}</span>
                  <span className="text-white/60 ml-2 flex-shrink-0">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/40">Subtotal</span>
                <span className="text-white/60">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Biaya Layanan</span>
                <span className="text-green-400">Gratis</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 mb-5">
              <div className="flex justify-between">
                <span className="font-display font-bold text-white">Total</span>
                <span className="font-display font-bold text-[var(--gold)] text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-lg hover:bg-[var(--gold-dim)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#080b11]/30 border-t-[#080b11] rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <>Bayar Sekarang <ChevronRight className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-center text-xs text-white/20 mt-3">
              Dengan melanjutkan, kamu menyetujui syarat & ketentuan kami
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

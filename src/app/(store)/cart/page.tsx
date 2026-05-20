'use client'
// src/app/(store)/cart/page.tsx

import Link from 'next/link'
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-[var(--gold)]" />
        </div>
        <h2 className="font-display font-bold text-3xl text-white mb-3">Keranjang Kosong</h2>
        <p className="text-white/40 mb-8">Belum ada produk di keranjangmu.</p>
        <Link href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] transition-all">
          Mulai Belanja <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-4xl text-white">Keranjang</h1>
        <button onClick={clearCart} className="text-sm text-white/30 hover:text-red-400 transition-colors flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" /> Kosongkan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[#141821] border border-white/5">
              <div className="w-16 h-16 rounded-xl bg-[#1a2030] flex-shrink-0 overflow-hidden">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-display">IMG</div>
                }
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-white text-sm truncate">{item.name}</h3>
                <p className="text-[var(--gold)] font-bold mt-0.5">{formatCurrency(item.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-white font-medium w-6 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 sticky top-24">
            <h3 className="font-display font-bold text-white text-lg mb-4">Ringkasan</h3>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/40 truncate flex-1">{item.name} x{item.qty}</span>
                  <span className="text-white/70 ml-2 flex-shrink-0">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-3 mb-5">
              <div className="flex justify-between">
                <span className="font-display font-bold text-white">Total</span>
                <span className="font-display font-bold text-[var(--gold)] text-xl">{formatCurrency(totalPrice())}</span>
              </div>
            </div>
            <Link href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold hover:bg-[var(--gold-dim)] transition-all">
              Lanjut Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products" className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 text-sm text-white/40 hover:text-white/70 transition-colors">
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

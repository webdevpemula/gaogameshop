'use client'
// src/app/(store)/products/[slug]/add-to-cart-button.tsx

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/types/database'

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold text-lg tracking-wide transition-all ${
        product.stock === 0
          ? 'bg-white/5 text-white/30 cursor-not-allowed'
          : added
            ? 'bg-green-500 text-white'
            : 'bg-[var(--gold)] text-[#080b11] hover:bg-[var(--gold-dim)] hover:shadow-lg hover:shadow-[rgba(245,166,35,0.2)]'
      }`}
    >
      {added ? (
        <><Check className="w-5 h-5" /> Ditambahkan!</>
      ) : (
        <><ShoppingCart className="w-5 h-5" /> {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}</>
      )}
    </button>
  )
}

'use client'
// src/components/products/product-card.tsx

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Zap } from 'lucide-react'
import { formatCurrency, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import type { ProductWithCategory } from '@/types/database'

interface ProductCardProps {
  product: ProductWithCategory
  variant?: 'default' | 'compact'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const discount = discountPercent(product.original_price ?? 0, product.price)

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.slug}`}
        className="group flex items-center gap-3 p-3 rounded-xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a2030] flex-shrink-0">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-display">IMG</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{product.name}</p>
          <p className="text-[var(--gold)] text-sm font-display font-bold">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    )
  }

  return (
    <div className="group gradient-border rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/30">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#0e1117] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <span className="text-xs text-white/20 font-display">{product.categories?.name}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-bold">
              -{discount}%
            </span>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-orange-500/80 text-white text-xs font-bold">
              Hampir Habis
            </span>
          )}
        </div>

        {/* Category label */}
        {product.categories && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/60 text-xs">
              {product.categories.name}
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display font-semibold text-white text-base leading-tight mb-1 group-hover:text-[var(--gold)] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-3">
          <div>
            {product.original_price && product.original_price > product.price && (
              <p className="text-xs text-white/30 line-through">{formatCurrency(product.original_price)}</p>
            )}
            <p className="text-[var(--gold)] font-display font-bold text-lg leading-none">
              {formatCurrency(product.price)}
            </p>
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--gold)] text-[#080b11] text-xs font-bold font-display hover:bg-[var(--gold-dim)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock === 0 ? 'Habis' : 'Beli'}
          </button>
        </div>
      </div>
    </div>
  )
}

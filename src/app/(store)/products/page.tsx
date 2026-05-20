'use client'
// src/app/(store)/products/page.tsx

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from '@/components/products/product-card'
import { ProductCardSkeleton } from '@/components/shared/loading-skeleton'
import type { ProductWithCategory, Category } from '@/types/database'

// 1. Definisikan tipe union khusus untuk product_type sesuai skema Supabase
type ProductType = 'topup' | 'voucher' | 'ppob';

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? 'all')
  
  // 2. Berikan tipe data literal yang longgar ('all') pada state activeType
  const [activeType, setActiveType] = useState<ProductType | 'all'>((searchParams.get('type') as any) ?? 'all')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('sort_order')

    if (activeCategory !== 'all') {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', activeCategory).single()
      if (cat) query = query.eq('category_id', cat.id)
    }
    
    // 3. Berikan asersi tipe data (as ProductType) agar Supabase menerima variabelnya
    if (activeType !== 'all') {
      query = query.eq('product_type', activeType as ProductType)
    }
    
    if (search) query = query.ilike('name', `%${search}%`)

    const { data } = await query.limit(40)
    setProducts((data ?? []) as any)
    setLoading(false)
  }, [activeCategory, activeType, search])

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order')
      setCategories((data as any) ?? [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const types = [
    { value: 'all', label: 'Semua' },
    { value: 'topup', label: 'Top Up' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'ppob', label: 'PPOB' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-white mb-2">Semua Produk</h1>
        <p className="text-white/40">Top up game, voucher digital, dan layanan PPOB</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#141821] border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.5)] transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {types.map(t => (
          <button key={t.value} onClick={() => setActiveType(t.value as ProductType | 'all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-display font-semibold transition-all ${
              activeType === t.value
                ? 'bg-[var(--gold)] text-[#080b11]'
                : 'bg-[#141821] text-white/50 border border-white/5 hover:border-[rgba(245,166,35,0.3)] hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
        <button onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all' ? 'bg-[rgba(245,166,35,0.15)] text-[var(--gold)] border border-[rgba(245,166,35,0.3)]' : 'bg-[#141821] text-white/40 border border-white/5 hover:text-white/70'
          }`}>
          Semua Kategori
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.slug)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.slug ? 'bg-[rgba(245,166,35,0.15)] text-[var(--gold)] border border-[rgba(245,166,35,0.3)]' : 'bg-[#141821] text-white/40 border border-white/5 hover:text-white/70'
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-white/30 mb-4">
          {products.length} produk ditemukan
          {search && <span> untuk "<span className="text-white/60">{search}</span>"</span>}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length > 0
            ? products.map(p => <ProductCard key={p.id} product={p} />)
            : (
              <div className="col-span-full text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-[var(--gold)]" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-white/40 text-sm">Coba ubah filter atau kata kunci pencarianmu</p>
                <button onClick={() => { setSearch(''); setActiveCategory('all'); setActiveType('all') }}
                  className="mt-4 px-4 py-2 rounded-lg bg-[rgba(245,166,35,0.1)] text-[var(--gold)] text-sm hover:bg-[rgba(245,166,35,0.2)] transition-all">
                  Reset Filter
                </button>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-white/40 text-sm">
        Memuat halaman produk...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
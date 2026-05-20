// src/app/(store)/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Zap, Star, Shield, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, discountPercent } from '@/lib/utils'
import AddToCartButton from './add-to-cart-button'
import type { Metadata } from 'next'

// Definisi Props yang aman untuk Next.js terbaru
type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('name, description').eq('slug', params.slug).single()
  if (!product) return { title: 'Produk Tidak Ditemukan' }
  return { title: product.name, description: product.description ?? undefined }
}

export default async function ProductDetailPage({ params }: Props) {
  const supabase = await createClient()

  // Ambil data product
  const { data: productData } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!productData) notFound()

  // Amankan tipe data yang diterima agar TypeScript tidak protes pada properti categories
  const product = productData as any;

  // Ambil produk terkait
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  const related = (relatedData as any[]) ?? [];

  const discount = discountPercent(product.original_price ?? 0, product.price)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
        <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white/60 transition-colors">Produk</Link>
        <span>/</span>
        {product.categories && (
          <>
            <Link href={`/products?category=${product.categories.slug}`} className="hover:text-white/60 transition-colors">
              {product.categories.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#141821] border border-white/5">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                <Zap className="w-10 h-10 text-[var(--gold)]" />
              </div>
              <span className="text-white/20 font-display text-xl">{product.categories?.name}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-bold">
              HEMAT {discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.categories && (
            <Link href={`/products?category=${product.categories.slug}`}
              className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-lg bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)] text-[var(--gold)] text-xs font-medium mb-4 hover:bg-[rgba(245,166,35,0.15)] transition-all">
              {product.categories.name}
            </Link>
          )}

          <h1 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-white/50 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Price */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/5 mb-6">
            {product.original_price && product.original_price > product.price && (
              <p className="text-white/30 line-through text-sm mb-1">{formatCurrency(product.original_price)}</p>
            )}
            <p className="font-display font-bold text-4xl text-[var(--gold)]">{formatCurrency(product.price)}</p>
            {discount > 0 && (
              <p className="text-green-400 text-sm mt-1">Hemat {formatCurrency((product.original_price ?? 0) - product.price)}</p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-white/50">
              {product.stock === 0 ? 'Stok habis' : product.stock <= 10 ? `Sisa ${product.stock} item` : 'Stok tersedia'}
            </span>
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Zap, label: 'Proses Instan' },
              { icon: Shield, label: 'Transaksi Aman' },
              { icon: Clock, label: 'Support 24/7' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#141821] border border-white/5 text-center">
                <Icon className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`}
                className="group p-4 rounded-xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.3)] transition-all">
                <p className="font-display font-semibold text-sm text-white group-hover:text-[var(--gold)] transition-colors line-clamp-2 mb-2">{p.name}</p>
                <p className="text-[var(--gold)] font-bold text-sm">{formatCurrency(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
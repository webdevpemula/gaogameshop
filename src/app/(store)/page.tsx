'use client'
import Link from 'next/link'
import { Zap, Shield, Clock, Headphones, ArrowRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/products/product-card'
import type { ProductWithCategory } from '@/types/database'

// Fetch data server-side
async function getHomeData() {
  const supabase = await createClient()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order').limit(10),
    supabase.from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('sort_order')
      .limit(8),
  ])

  return { categories: categories ?? [], products: (products ?? []) as ProductWithCategory[] }
}

const features = [
  { icon: Zap, title: 'Proses Instan', desc: 'Top up terproses dalam hitungan detik' },
  { icon: Shield, title: 'Aman & Terpercaya', desc: 'Transaksi aman dengan enkripsi penuh' },
  { icon: Clock, title: '24/7 Tersedia', desc: 'Layanan aktif sepanjang waktu' },
  { icon: Headphones, title: 'Support Responsif', desc: 'Tim siap membantu kapanpun' },
]

const categoryIcons: Record<string, string> = {
  'mobile-legends': '⚔️', 'free-fire': '🔥', 'pubg-mobile': '🎯',
  'genshin-impact': '✨', 'valorant': '🎮', 'steam-wallet': '🖥️',
  'google-play': '▶️', 'netflix': '🎬', 'spotify': '🎵',
  'pln': '⚡', 'pulsa-data': '📱', 'lainnya': '🎲',
}

export default async function HomePage() {
  const { categories, products } = await getHomeData()

  return (
    <div className="overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[rgba(245,166,35,0.05)] blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[rgba(245,166,35,0.03)] blur-[80px]" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)] mb-6 animate-fade-up">
            <Star className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="text-xs text-[var(--gold)] font-medium">Platform Top Up #1 Terpercaya</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-7xl font-bold leading-none tracking-tight mb-6 animate-fade-up-delay-1">
            <span className="text-white">TOP UP </span>
            <span className="text-[var(--gold)] glow-gold-text">GAME</span>
            <br />
            <span className="text-white/60 text-4xl sm:text-5xl font-semibold">Cepat. Aman. Terjangkau.</span>
          </h1>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8 font-body animate-fade-up-delay-2">
            Diamond, UC, Voucher, PPOB — semua tersedia. Proses otomatis, harga kompetitif, transaksi aman.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-delay-3">
            <Link href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-lg tracking-wide hover:bg-[var(--gold-dim)] transition-all hover:shadow-lg hover:shadow-[rgba(245,166,35,0.2)]">
              Mulai Top Up
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 text-white font-display font-semibold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
              Daftar Gratis
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-up-delay-4">
            {[
              { value: '50K+', label: 'Transaksi' },
              { value: '10K+', label: 'Pengguna' },
              { value: '99.9%', label: 'Sukses' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-2xl text-[var(--gold)]">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-3xl text-white">Kategori Game</h2>
                <p className="text-white/40 text-sm mt-1">Pilih game favoritmu</p>
              </div>
              <Link href="/products" className="flex items-center gap-1.5 text-sm text-[var(--gold)] hover:text-[var(--gold-dim)] transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.4)] hover:bg-[rgba(245,166,35,0.05)] transition-all"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-2xl">{categoryIcons[cat.slug] ?? '🎮'}</span>
                  <span className="text-xs text-white/50 group-hover:text-white/80 text-center leading-tight font-medium transition-colors line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-3xl text-white">Produk Unggulan</h2>
                <p className="text-white/40 text-sm mt-1">Top up populer hari ini</p>
              </div>
              <Link href="/products" className="flex items-center gap-1.5 text-sm text-[var(--gold)] hover:text-[var(--gold-dim)] transition-colors">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EMPTY STATE (saat belum ada produk) ──────────────── */}
      {products.length === 0 && (
        <section className="py-16 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[var(--gold)]" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Produk Segera Hadir</h3>
            <p className="text-white/40 text-sm">Admin sedang menyiapkan produk. Cek lagi sebentar ya!</p>
          </div>
        </section>
      )}

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-[#141821] border border-white/5 hover:border-[rgba(245,166,35,0.2)] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center mb-4 group-hover:bg-[rgba(245,166,35,0.15)] transition-all">
                  <Icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-10 rounded-3xl bg-[#141821] border border-[rgba(245,166,35,0.2)] overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(245,166,35,0.15), transparent)' }} />
            <div className="relative">
              <h2 className="font-display font-bold text-4xl text-white mb-3">
                Mulai Top Up <span className="text-[var(--gold)]">Sekarang</span>
              </h2>
              <p className="text-white/40 mb-6">Daftar gratis dan nikmati kemudahan top up kapanpun, dimanapun.</p>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--gold)] text-[#080b11] font-display font-bold text-lg hover:bg-[var(--gold-dim)] transition-all">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


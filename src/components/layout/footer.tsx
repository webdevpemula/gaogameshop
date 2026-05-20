'use client'
// src/components/layout/footer.tsx

import Link from 'next/link'
import { Gamepad2, Camera, Play, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080b11] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center">
                <Gamepad2 className="w-4.5 h-4.5 text-[#080b11]" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-[var(--gold)]">GAO</span>
                <span className="text-white">GAME</span>
                <span className="text-white/40">SHOP</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-4">
              Platform top up game & voucher digital terpercaya. Proses cepat, harga terbaik.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: '#', label: 'Instagram' },
                { icon: Play, href: '#', label: 'YouTube' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-[var(--gold)] hover:bg-[rgba(245,166,35,0.1)] transition-all"
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 tracking-wide">Produk</h4>
            <ul className="space-y-2">
              {['Top Up Game', 'Voucher Game', 'PPOB', 'Steam Wallet', 'Google Play'].map(item => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-white/40 hover:text-white/80 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 tracking-wide">Akun</h4>
            <ul className="space-y-2">
              {[
                { label: 'Daftar', href: '/register' },
                { label: 'Masuk', href: '/login' },
                { label: 'Pesanan Saya', href: '/account/orders' },
                { label: 'Dompet', href: '/account/wallet' },
                { label: 'Pengaduan', href: '/account/complaints' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-display font-bold text-white mb-4 tracking-wide">Bantuan</h4>
            <ul className="space-y-2">
              {['Cara Pembelian', 'Metode Pembayaran', 'Kebijakan Refund', 'Syarat & Ketentuan', 'Hubungi Kami'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © 2025 GaoGameShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/25">Pembayaran aman via</span>
            <div className="flex gap-2">
              {['Midtrans', 'QRIS', 'VA'].map(method => (
                <span key={method} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/30 font-medium">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

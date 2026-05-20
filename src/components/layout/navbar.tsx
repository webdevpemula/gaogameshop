'use client'
// src/components/layout/navbar.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Gamepad2, Wallet, User, LogOut, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useUser } from '@/hooks/use-user'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { label: 'Top Up', href: '/products?type=topup' },
  { label: 'Voucher', href: '/products?type=voucher' },
  { label: 'PPOB', href: '/products?type=ppob' },
  { label: 'Promo', href: '/promo' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const totalItems = useCartStore(s => s.totalItems())
  const { user, profile, loading } = useUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080b11]/95 backdrop-blur-md border-b border-[rgba(245,166,35,0.15)] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center group-hover:glow-gold transition-all">
                <Gamepad2 className="w-4.5 h-4.5 text-[#080b11]" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold tracking-wide">
                <span className="text-[var(--gold)]">GAO</span>
                <span className="text-white">GAME</span>
                <span className="text-[rgba(255,255,255,0.5)]">SHOP</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-display tracking-wide transition-all ${
                    pathname === link.href
                      ? 'text-[var(--gold)] bg-[rgba(245,166,35,0.1)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[var(--gold)] text-[#080b11] text-[10px] font-bold flex items-center justify-center animate-pulse-gold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {loading ? (
                <div className="w-24 h-8 rounded-lg animate-shimmer" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141821] border border-[rgba(245,166,35,0.2)] hover:border-[rgba(245,166,35,0.5)] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#080b11] text-xs font-bold">
                      {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-sm text-white/80 font-medium max-w-[80px] truncate hidden sm:block">
                      {profile?.full_name?.split(' ')[0] ?? 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#141821] border border-[rgba(245,166,35,0.2)] shadow-xl shadow-black/40 z-20 overflow-hidden">
                        {/* Saldo */}
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-xs text-white/40 mb-1">Saldo</p>
                          <p className="text-[var(--gold)] font-display font-bold text-lg">
                            {formatCurrency(profile?.saldo ?? 0)}
                          </p>
                        </div>
                        <div className="p-1.5">
                          <Link href="/account" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <User className="w-4 h-4" /> Akun Saya
                          </Link>
                          <Link href="/account/wallet" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <Wallet className="w-4 h-4" /> Dompet
                          </Link>
                          <div className="border-t border-white/5 mt-1 pt-1">
                            <button onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                              <LogOut className="w-4 h-4" /> Keluar
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login"
                    className="hidden sm:block px-4 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-all">
                    Masuk
                  </Link>
                  <Link href="/register"
                    className="px-4 py-1.5 rounded-lg text-sm font-bold bg-[var(--gold)] text-[#080b11] hover:bg-[var(--gold-dim)] transition-all font-display tracking-wide">
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0e1117] border-t border-white/5 px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="block px-4 py-2.5 rounded-lg text-sm font-display font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login"
                className="block px-4 py-2.5 rounded-lg text-sm font-display font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                Masuk
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

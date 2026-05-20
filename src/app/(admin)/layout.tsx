'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, CreditCard, MessageCircle, Gamepad2, LogOut } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard',    href: '/admin',                icon: LayoutDashboard },
  { label: 'Produk',       href: '/admin/products',       icon: Package },
  { label: 'Pesanan',      href: '/admin/orders',         icon: ShoppingBag },
  { label: 'Pengguna',     href: '/admin/users',          icon: Users },
  { label: 'Transaksi',    href: '/admin/transactions',   icon: CreditCard },
  { label: 'Pengaduan',    href: '/admin/complaints',     icon: MessageCircle },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/')
  }, [user, isAdmin, loading, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0e1117] border-r border-white/5 flex flex-col fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--gold)] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-[#080b11]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white leading-none">GaoGameShop</p>
              <p className="text-[10px] text-[var(--gold)] mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-[rgba(245,166,35,0.12)] text-[var(--gold)] font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen bg-[#080b11]">
        {children}
      </main>
    </div>
  )
}

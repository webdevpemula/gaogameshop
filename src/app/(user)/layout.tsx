// src/app/(user)/layout.tsx
import Link from 'next/link'
import { ShoppingBag, Wallet, MessageCircle, User, Home } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/account', icon: Home },
  { label: 'Pesanan', href: '/account/orders', icon: ShoppingBag },
  { label: 'Dompet', href: '/account/wallet', icon: Wallet },
  { label: 'Pengaduan', href: '/account/complaints', icon: MessageCircle },
  { label: 'Profil', href: '/account/profile', icon: User },
]

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all group">
                <item.icon className="w-4 h-4 group-hover:text-[var(--gold)] transition-colors" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0e1117]/95 backdrop-blur-md border-t border-white/5 flex z-50">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-white/40 hover:text-[var(--gold)] transition-colors">
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  )
}

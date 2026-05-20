// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'GaoGameShop — Top Up Game & Voucher Digital', template: '%s | GaoGameShop' },
  description: 'Platform top up game, voucher digital, dan PPOB terpercaya. Mobile Legends, Free Fire, PUBG, Genshin Impact, dan lebih banyak lagi.',
  keywords: ['top up game', 'voucher digital', 'mobile legends diamond', 'free fire diamond', 'PPOB'],
  openGraph: {
    title: 'GaoGameShop — Top Up Game & Voucher Digital',
    description: 'Platform top up game & voucher digital terpercaya di Indonesia.',
    url: 'https://gaogameshop.id',
    siteName: 'GaoGameShop',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

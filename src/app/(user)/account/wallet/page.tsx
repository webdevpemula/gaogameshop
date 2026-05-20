'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Jika Anda tidak ingin memindahkan kode, bungkus saja komponen utama Anda:
function WalletContent() {
   const searchParams = useSearchParams()
   // ... kode logika wallet Anda
   return <div>Konten Wallet</div>
}

export default function WalletPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <WalletContent />
    </Suspense>
  )
}
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
// ... import lain yang Anda miliki

// 1. Pindahkan logika utama ke komponen ini
function ComplaintsContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  
  // Gunakan orderId di sini...
  
  return (
    <div>
      {/* Konten halaman Anda */}
      <h1>Halaman Komplain</h1>
      <p>Order ID: {orderId}</p>
    </div>
  )
}

// 2. Komponen ini adalah default export yang membungkus konten dengan Suspense
export default function ComplaintsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/50">Memuat...</div>}>
      <ComplaintsContent />
    </Suspense>
  )
}
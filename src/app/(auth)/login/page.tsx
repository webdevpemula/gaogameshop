'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
// ... import komponen lain yang Anda gunakan di login

function LoginContent() {
  const searchParams = useSearchParams()
  // ... logika login Anda, misalnya: const redirect = searchParams.get('redirect')

  return (
    <div>
      {/* Isi form login Anda di sini */}
    </div>
  )
}

export default function LoginPage() {
  return (
    // Pembungkus Suspense adalah kunci agar build tidak error
    <Suspense fallback={<div className="p-8 text-center text-white/50">Memuat...</div>}>
      <LoginContent />
    </Suspense>
  )
}
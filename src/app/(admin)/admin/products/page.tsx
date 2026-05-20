'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Komponen logika utama
const ProductsContent = dynamic(() => import('./_components/products-content'), { 
  ssr: false, 
  loading: () => <div>Loading...</div> 
})

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
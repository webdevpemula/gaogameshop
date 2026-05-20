// src/components/shared/loading-skeleton.tsx

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#141821] border border-white/5">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded animate-shimmer w-3/4" />
        <div className="h-3 rounded animate-shimmer w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-5 rounded animate-shimmer w-1/3" />
          <div className="h-8 w-16 rounded-lg animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-2xl animate-shimmer" />
      <div className="h-3 w-14 rounded animate-shimmer" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-8 w-48 rounded animate-shimmer mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

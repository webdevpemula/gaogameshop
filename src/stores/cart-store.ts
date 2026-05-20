// src/stores/cart-store.ts
// Cart state management dengan Zustand

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/database'

export type CartProduct = Product & {
  qty: number
  game_target_id?: string
  game_target_server?: string
}

interface CartStore {
  items: CartProduct[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  updateGameTarget: (productId: string, targetId: string, server?: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const existing = get().items.find(i => i.id === product.id)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.id === product.id ? { ...i, qty: i.qty + qty } : i
            ),
          }))
        } else {
          set(state => ({ items: [...state.items, { ...product, qty }] }))
        }
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.id !== productId) }))
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === productId ? { ...i, qty } : i
          ),
        }))
      },

      updateGameTarget: (productId, targetId, server) => {
        set(state => ({
          items: state.items.map(i =>
            i.id === productId
              ? { ...i, game_target_id: targetId, game_target_server: server }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'gaogameshop-cart',
    }
  )
)

// src/types/database.ts
// Generated types untuk gaogameshop.id Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          saldo: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          saldo?: number
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          saldo?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon_url: string | null
          banner_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          icon_url?: string | null
          banner_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          icon_url?: string | null
          banner_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          product_type: 'topup' | 'voucher' | 'ppob'
          name: string
          slug: string
          description: string | null
          price: number
          original_price: number | null
          stock: number
          image_url: string | null
          is_active: boolean
          sort_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          product_type?: 'topup' | 'voucher' | 'ppob'
          name: string
          slug: string
          description?: string | null
          price: number
          original_price?: number | null
          stock?: number
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          metadata?: Json
        }
        Update: {
          category_id?: string | null
          product_type?: 'topup' | 'voucher' | 'ppob'
          name?: string
          slug?: string
          description?: string | null
          price?: number
          original_price?: number | null
          stock?: number
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          metadata?: Json
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          qty: number
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          qty?: number
        }
        Update: {
          qty?: number
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
          payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          total: number
          payment_method: string | null
          midtrans_order_id: string | null
          midtrans_token: string | null
          game_target_id: string | null
          game_target_server: string | null
          notes: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_number: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
          payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          total: number
          payment_method?: string | null
          midtrans_order_id?: string | null
          midtrans_token?: string | null
          game_target_id?: string | null
          game_target_server?: string | null
          notes?: string | null
        }
        Update: {
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
          payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          midtrans_order_id?: string | null
          midtrans_token?: string | null
          paid_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_image: string | null
          qty: number
          price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          order_id: string
          product_id?: string | null
          product_name: string
          product_image?: string | null
          qty: number
          price: number
          subtotal: number
        }
        Update: never
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'topup' | 'debit' | 'refund'
          amount: number
          balance_before: number
          balance_after: number
          ref_id: string | null
          description: string | null
          status: 'pending' | 'success' | 'failed'
          created_at: string
        }
        Insert: {
          user_id: string
          type: 'topup' | 'debit' | 'refund'
          amount: number
          balance_before: number
          balance_after: number
          ref_id?: string | null
          description?: string | null
          status?: 'pending' | 'success' | 'failed'
        }
        Update: {
          status?: 'pending' | 'success' | 'failed'
        }
      }
      complaints: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          subject: string
          message: string
          attachment_url: string | null
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          admin_reply: string | null
          replied_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          order_id?: string | null
          subject: string
          message: string
          attachment_url?: string | null
        }
        Update: {
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          admin_reply?: string | null
          replied_at?: string | null
        }
      }
    }
    Enums: {
      user_role: 'customer' | 'admin'
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
      payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded'
      transaction_type: 'topup' | 'debit' | 'refund'
      transaction_status: 'pending' | 'success' | 'failed'
      complaint_status: 'open' | 'in_progress' | 'resolved' | 'closed'
      product_type: 'topup' | 'voucher' | 'ppob'
    }
  }
}

// ============================================================
// CONVENIENCE TYPES
// ============================================================
export type Profile     = Database['public']['Tables']['profiles']['Row']
export type Category    = Database['public']['Tables']['categories']['Row']
export type Product     = Database['public']['Tables']['products']['Row']
export type CartItem    = Database['public']['Tables']['cart_items']['Row']
export type Order       = Database['public']['Tables']['orders']['Row']
export type OrderItem   = Database['public']['Tables']['order_items']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Complaint   = Database['public']['Tables']['complaints']['Row']

// Joined types yang sering dipakai
export type ProductWithCategory = Product & { categories: Category | null }
export type OrderWithItems      = Order  & { order_items: OrderItem[] }
export type CartItemWithProduct = CartItem & { products: Product }

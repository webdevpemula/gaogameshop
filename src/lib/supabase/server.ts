import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
// 1. Import tipe Database yang baru di-generate
import type { Database } from './database.types' 

export function createClient() {
  // 2. Sisipkan <Database> di sini
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
export function createAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
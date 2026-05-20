
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types' 

export function createClient() {
  // 2. Sisipkan <Database> di sini
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
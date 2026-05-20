// src/hooks/use-user.ts
// Hook untuk akses user & profile dari client component

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface UserState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
}

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
  })

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setState({ user: null, profile: null, loading: false, isAdmin: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setState({
        user,
        profile,
        loading: false,
        isAdmin: profile?.role === 'admin',
      })
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}

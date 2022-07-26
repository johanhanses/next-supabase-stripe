import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/router'
import axios from 'axios'

const UserContext = createContext(undefined as any)

export default function UserProvider({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState(undefined as any)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        setUser({ ...sessionUser, ...profile })
        setIsLoading(false)
      }
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  useEffect(() => {
    axios.post(`/api/set-supabase-cookie`, {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
      session: supabase.auth.session()
    })
  }, [user])

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .from(`profile:id:${user.id}`)
        .on('UPDATE', (payload) => {
          setUser({ ...user, ...payload.new })
        })
        .subscribe()

      return () => {
        supabase.removeSubscription(subscription)
      }
    }
  }, [user])

  const login = async () => {
    await supabase.auth.signIn({
      provider: 'github'
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const exposed = {
    user,
    login,
    logout,
    isLoading
  }

  return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

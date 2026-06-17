import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setIsLoading: (isLoading: boolean) => void
  clearAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setAuth: (user, token) => {
        document.cookie = `techserv-role=${user.role}; path=/; max-age=86400; SameSite=Lax`
        set({ user, token })
      },
      setIsLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => {
        document.cookie = 'techserv-role=; path=/; max-age=0'
        set({ user: null, token: null })
      },
    }),
    {
      name: 'techserv-auth',
    }
  )
)

export default useAuthStore
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  setAuth: (user: User, token: string, refreshToken: string) => void
  setTokens: (token: string, refreshToken: string) => void
  setIsLoading: (isLoading: boolean) => void
  clearAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      setAuth: (user, token, refreshToken) => {
        document.cookie = `techserv-role=${user.role}; path=/; max-age=86400; SameSite=Lax`
        set({ user, token, refreshToken })
      },
      setTokens: (token, refreshToken) => {
        set({ token, refreshToken })
      },
      setIsLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => {
        document.cookie = 'techserv-role=; path=/; max-age=0'
        set({ user: null, token: null, refreshToken: null })
      },
    }),
    {
      name: 'techserv-auth',
    }
  )
)

export default useAuthStore
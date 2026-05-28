import { create } from 'zustand'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
  clearUser: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null }),
}))

export default useAuthStore
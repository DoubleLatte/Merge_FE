import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logout as apiLogout, loginWithKakao } from '../api/auth'
import { getMe } from '../api/users'
import type { User } from '../api/types'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { onTokensCleared, tokenStorage } from './tokenStorage'

/** QueryClientProvider 안쪽에 둘 것. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => !!tokenStorage.getAccessToken())
  const [isLoginPromptOpen, setPromptOpen] = useState(false)

  const refreshUser = useCallback(async () => {
    setUser(await getMe())
  }, [])

  useEffect(() => {
    let cancelled = false
    if (tokenStorage.getAccessToken()) {
      getMe()
        .then((u) => !cancelled && setUser(u))
        .catch(() => {
          /* 만료/무효 토큰은 client가 이미 정리한다 */
        })
        .finally(() => !cancelled && setIsLoading(false))
    }
    // 갱신 실패 등으로 토큰이 지워지면 로그아웃 상태로 전환
    const off = onTokensCleared(() => {
      setUser(null)
      qc.clear()
    })
    return () => {
      cancelled = true
      off()
    }
  }, [qc])

  const loginWithKakaoCode = useCallback(async (code: string) => {
    const res = await loginWithKakao(code)
    setUser(await getMe())
    setPromptOpen(false)
    return { isNewUser: res.is_new_user }
  }, [])

  const logout = useCallback(async () => {
    await apiLogout() // 토큰 정리 → onTokensCleared로 user/캐시 초기화
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isLoggedIn: !!user,
      loginWithKakaoCode,
      logout,
      refreshUser,
      isLoginPromptOpen,
      openLoginPrompt: () => setPromptOpen(true),
      closeLoginPrompt: () => setPromptOpen(false),
    }),
    [user, isLoading, loginWithKakaoCode, logout, refreshUser, isLoginPromptOpen],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { useCallback, useContext } from 'react'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { saveReturnTo } from './kakao'

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 <AuthProvider> 안에서 사용해야 합니다.')
  return ctx
}

/**
 * 로그인 필요 동작의 가드. 로그인 상태면 action 실행,
 * 아니면 현재 경로를 저장하고 로그인 유도 모달(A2)을 연다.
 */
export function useRequireLogin(): (action?: () => void) => void {
  const { isLoggedIn, openLoginPrompt } = useAuth()
  return useCallback(
    (action) => {
      if (isLoggedIn) {
        action?.()
      } else {
        saveReturnTo(window.location.pathname + window.location.search)
        openLoginPrompt()
      }
    },
    [isLoggedIn, openLoginPrompt],
  )
}

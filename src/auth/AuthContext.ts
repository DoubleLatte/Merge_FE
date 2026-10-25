import { createContext } from 'react'
import type { User } from '../api/types'

export interface AuthContextValue {
  user: User | null
  /** 토큰이 있고 사용자 정보를 불러오는 중 */
  isLoading: boolean
  isLoggedIn: boolean
  /** 성공 시 is_new_user 반환 (true면 약관 화면으로) */
  loginWithKakaoCode: (code: string) => Promise<{ isNewUser: boolean }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  /** A2 로그인 유도 모달 상태. UI가 isLoginPromptOpen으로 렌더링하고 닫을 때 closeLoginPrompt 호출 */
  isLoginPromptOpen: boolean
  openLoginPrompt: () => void
  closeLoginPrompt: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

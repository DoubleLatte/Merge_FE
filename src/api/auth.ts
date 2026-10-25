import { api, request } from './client'
import { tokenStorage } from '../auth/tokenStorage'
import type { KakaoLoginResult } from './types'

/** 카카오 인가 코드를 토큰으로 교환하고 저장한다. */
export async function loginWithKakao(code: string): Promise<KakaoLoginResult> {
  const result = await api.post<KakaoLoginResult>('/auth/kakao', { code }, { auth: false })
  tokenStorage.setTokens(result)
  return result
}

/** 서버에 refresh 토큰 폐기를 요청하되, 실패해도 로컬 토큰은 반드시 지운다. */
export async function logout(): Promise<void> {
  const refresh_token = tokenStorage.getRefreshToken()
  try {
    if (refresh_token && tokenStorage.getAccessToken()) {
      await request<unknown>('POST', '/auth/logout', { body: { refresh_token } })
    }
  } catch {
    /* 서버 폐기 실패는 무시 */
  } finally {
    tokenStorage.clear()
  }
}

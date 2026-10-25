// 토큰 저장소(localStorage). 접근이 막힌 환경(프라이빗 모드 등)에서도 죽지 않도록 메모리 폴백을 둔다.
const ACCESS_KEY = 'cheonanon.access_token'
const REFRESH_KEY = 'cheonanon.refresh_token'

const memory: Record<string, string | null> = {}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return memory[key] ?? null
  }
}
function write(key: string, value: string | null) {
  memory[key] = value
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* 저장 불가 환경: 메모리만 사용 */
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_KEY),
  getRefreshToken: () => read(REFRESH_KEY),
  setTokens(tokens: { access_token: string; refresh_token?: string }) {
    write(ACCESS_KEY, tokens.access_token)
    if (tokens.refresh_token) write(REFRESH_KEY, tokens.refresh_token)
  },
  clear() {
    write(ACCESS_KEY, null)
    write(REFRESH_KEY, null)
    listeners.forEach((fn) => fn())
  },
}

const listeners = new Set<() => void>()
/** 토큰이 비워질 때(로그아웃, 갱신 실패) 호출될 콜백을 등록한다. 해제 함수를 반환한다. */
export function onTokensCleared(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

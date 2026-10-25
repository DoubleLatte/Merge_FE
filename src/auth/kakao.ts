export function buildKakaoAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_REST_KEY ?? '',
    redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI ?? '',
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}

const RETURN_KEY = 'cheonanon.return_to'
/** 로그인 후 돌아올 경로 저장/소비 */
export function saveReturnTo(path: string) {
  try { sessionStorage.setItem(RETURN_KEY, path) } catch { /* 무시 */ }
}
export function consumeReturnTo(): string | null {
  try {
    const v = sessionStorage.getItem(RETURN_KEY)
    sessionStorage.removeItem(RETURN_KEY)
    return v
  } catch {
    return null
  }
}

const PENDING_KEY = 'cheonanon.pending_bookmark'
/** 비로그인 상태에서 누른 찜을 로그인 후 이어서 처리하기 위해 저장한다. */
export function savePendingBookmark(event: unknown) {
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(event)) } catch { /* 무시 */ }
}
export function clearPendingBookmark() {
  try { sessionStorage.removeItem(PENDING_KEY) } catch { /* 무시 */ }
}
export function consumePendingBookmark<T = unknown>(): T | null {
  try {
    const v = sessionStorage.getItem(PENDING_KEY)
    sessionStorage.removeItem(PENDING_KEY)
    return v ? (JSON.parse(v) as T) : null
  } catch {
    return null
  }
}

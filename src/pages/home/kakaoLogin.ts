import { buildKakaoAuthorizeUrl } from '../../auth'

/** 카카오 인가 페이지로 이동 (외부 화면은 만들지 않고 리다이렉트만) */
export function startKakaoLogin() {
  window.location.assign(buildKakaoAuthorizeUrl())
}

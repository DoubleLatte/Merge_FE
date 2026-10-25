// 카카오맵 JS SDK 로더. 스크립트는 한 번만 불러오고 autoload=false라 load()로 초기화한다.
type Kakao = typeof window & { kakao?: any }

let loading: Promise<any> | null = null

export function loadKakaoMaps(): Promise<any> {
  const w = window as Kakao
  if (w.kakao?.maps?.LatLng) return Promise.resolve(w.kakao)
  if (loading) return loading
  const key = import.meta.env.VITE_KAKAO_JS_KEY
  if (!key) return Promise.reject(new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다.'))
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`
    script.onload = () => w.kakao.maps.load(() => resolve(w.kakao))
    script.onerror = () => {
      loading = null
      reject(new Error('카카오맵 SDK를 불러오지 못했습니다.'))
    }
    document.head.appendChild(script)
  })
  return loading
}

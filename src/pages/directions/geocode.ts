import { loadKakaoMaps } from '../../lib/kakaoMaps'

export interface Place {
  name: string
  address: string
  lat: number
  lng: number
}

/** 출발지 검색: 카카오 장소 검색(키워드). SDK/키 문제 시 reject → 호출 측에서 안내한다. */
export async function searchPlaces(query: string): Promise<Place[]> {
  const q = query.trim()
  if (!q) return []
  const kakao = await loadKakaoMaps()
  if (!kakao.maps.services) throw new Error('장소 검색을 사용할 수 없어요.')
  return new Promise((resolve, reject) => {
    new kakao.maps.services.Places().keywordSearch(q, (data: any[], status: string) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(
          data.slice(0, 5).map((d) => ({
            name: d.place_name,
            address: d.road_address_name || d.address_name,
            lat: Number(d.y),
            lng: Number(d.x),
          })),
        )
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve([])
      } else {
        reject(new Error('장소 검색에 실패했어요.'))
      }
    })
  })
}

export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject,
      { timeout: 8000, maximumAge: 60_000 },
    )
  })
}

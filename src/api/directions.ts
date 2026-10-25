// ===== MOCK: 길찾기 =====
// BE 길찾기 API가 완성되면 getDirections 본문만 교체한다. (Figma D1: 대중교통 경로 카드 목록 —
// 총 소요시간·요금·환승 수와 도보/버스/지하철 구간 타임라인)
import type { DirectionsQuery, DirectionsResult, DirectionsRoute } from './types'

const R = 6371000
function haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(bLat - aLat)
  const dLng = rad(bLng - aLng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export async function getDirections(q: DirectionsQuery): Promise<DirectionsResult> {
  const dist = Math.max(300, Math.round(haversine(q.fromLat, q.fromLng, q.toLat, q.toLng)))
  const mid = (t: number): [number, number] => [
    q.fromLat + (q.toLat - q.fromLat) * t,
    q.fromLng + (q.toLng - q.fromLng) * t,
  ]
  const path: Array<[number, number]> = [[q.fromLat, q.fromLng], mid(0.3), mid(0.7), [q.toLat, q.toLng]]
  const walkA = Math.min(600, Math.round(dist * 0.08))
  const walkB = Math.min(500, Math.round(dist * 0.06))
  const ride = Math.max(100, dist - walkA - walkB)
  const walkMin = (m: number) => Math.max(1, Math.round(m / 70))

  const bus: DirectionsRoute = {
    id: 'mock-bus',
    total_minutes: walkMin(walkA) + walkMin(walkB) + Math.round(ride / 350) + 4,
    total_distance_m: dist,
    fare: 1500,
    transfers: 0,
    path,
    steps: [
      { type: 'walk', from: '출발지', to: '가까운 정류장', minutes: walkMin(walkA), distance_m: walkA },
      { type: 'bus', line: '버스 400', from: '가까운 정류장', to: '도착지 앞 정류장', minutes: Math.round(ride / 350) + 4, distance_m: ride, stops: Math.max(2, Math.round(ride / 600)) },
      { type: 'walk', from: '도착지 앞 정류장', to: '도착지', minutes: walkMin(walkB), distance_m: walkB },
    ],
  }
  const metro: DirectionsRoute = {
    id: 'mock-subway',
    total_minutes: walkMin(walkA) + walkMin(walkB) + Math.round(ride / 600) + 8,
    total_distance_m: dist,
    fare: 1650,
    transfers: 1,
    path,
    steps: [
      { type: 'walk', from: '출발지', to: '천안역', minutes: walkMin(walkA), distance_m: walkA },
      { type: 'subway', line: '1호선', from: '천안역', to: '두정역', minutes: Math.round(ride / 600) + 8, distance_m: ride, stops: Math.max(2, Math.round(ride / 1500)) },
      { type: 'walk', from: '두정역', to: '도착지', minutes: walkMin(walkB), distance_m: walkB },
    ],
  }
  await new Promise((r) => setTimeout(r, 150)) // 네트워크 지연 흉내
  return { mock: true, routes: [bus, metro].sort((a, b) => a.total_minutes - b.total_minutes) }
}

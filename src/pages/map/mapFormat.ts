import type { EventCard } from '../../api/types'
import { formatPrice } from '../../components'

/** 마커 라벨: 무료는 "무료", 숫자 가격은 "15,000원", 그 외 문자열 가격은 그대로 */
export function markerLabel(e: Pick<EventCard, 'is_free' | 'price'>): string {
  if (e.is_free) return '무료'
  return formatPrice(e.price) || '유료'
}

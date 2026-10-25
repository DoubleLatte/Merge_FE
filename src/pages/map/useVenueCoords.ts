import { useEffect, useMemo, useState } from 'react'
import type { EventCard } from '../../api/types'
import { geocodeKey, geocodeMany, getCachedCoord, type Coord } from './geocode'

export interface Located {
  event: EventCard
  coord: Coord
}

/** 카드의 venue_name(+시도)을 좌표로 변환한다. 캐시된 값은 즉시 반영, 나머지는 순차 조회. */
export function useVenueCoords(kakao: any | null, events: EventCard[]) {
  const [version, setVersion] = useState(0)
  const [doneFor, setDoneFor] = useState<unknown>(null)

  const keyed = useMemo(
    () =>
      events
        .filter((e) => !!e.venue_name)
        .map((e) => ({ event: e, key: geocodeKey(e.venue_name!, e.sido) })),
    [events],
  )

  useEffect(() => {
    if (!kakao) return
    const signal = { cancelled: false }
    const missing = keyed.filter((k) => getCachedCoord(k.key) === undefined).map((k) => k.key)
    if (missing.length === 0) return
    let pendingFlush = false
    void geocodeMany(kakao, missing, () => {
      if (pendingFlush) return
      pendingFlush = true
      setTimeout(() => {
        pendingFlush = false
        if (!signal.cancelled) setVersion((v) => v + 1)
      }, 150)
    }, signal).then(() => {
      if (!signal.cancelled) {
        setVersion((v) => v + 1)
        setDoneFor(keyed)
      }
    })
    return () => {
      signal.cancelled = true
    }
  }, [kakao, keyed])

  const located = useMemo<Located[]>(
    () => {
      void version // 캐시가 채워질 때마다 다시 계산
      return keyed.flatMap(({ event, key }) => {
        const c = getCachedCoord(key)
        return c ? [{ event, coord: c }] : []
      })
    },
    [keyed, version],
  )
  const settled =
    !!kakao && (doneFor === keyed || keyed.every((k) => getCachedCoord(k.key) !== undefined))
  const unlocatedCount = settled ? keyed.length - located.length + (events.length - keyed.length) : 0
  return { located, settled, unlocatedCount }
}

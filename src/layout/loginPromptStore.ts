import { useSyncExternalStore } from 'react'
import type { EventCard } from '../api/types'

/**
 * A2 로그인 유도 모달에 "방금 고른 행사"를 보여주기 위한 작은 전역 저장소.
 * 로그인 가드(useRequireLogin)를 부르기 직전에 setLoginPromptEvent(event)를 호출한다.
 * 이벤트 없이 열리면 모달은 행사 카드 없이 일반 문구로 표시된다.
 */
let current: EventCard | null = null
const listeners = new Set<() => void>()

export function setLoginPromptEvent(event: EventCard | null) {
  current = event
  listeners.forEach((l) => l())
}

export function useLoginPromptEvent(): EventCard | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
    () => null,
  )
}

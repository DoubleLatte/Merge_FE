// ===== MOCK: 찜 =====
// BE에 찜 API가 없어 localStorage에 사용자별로 저장한다. 훅 인터페이스(hooks.ts)는 유지하고
// 이 파일의 세 함수만 실제 API 호출로 바꾸면 된다.
import type { EventCard } from './types'

const key = (userId: number) => `cheonanon.mock.bookmarks.${userId}`

function read(userId: number): EventCard[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key(userId)) ?? '[]')
    return Array.isArray(parsed) ? (parsed as EventCard[]) : []
  } catch {
    return []
  }
}
function write(userId: number, list: EventCard[]) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(list))
  } catch {
    /* 저장 불가 */
  }
}

export async function listBookmarks(userId: number): Promise<EventCard[]> {
  return read(userId)
}
/** 카드 스냅샷을 함께 저장해 목록에서 추가 조회 없이 보여준다. */
export async function addBookmark(userId: number, event: EventCard): Promise<void> {
  const list = read(userId).filter((e) => e.id !== event.id)
  write(userId, [event, ...list])
}
export async function removeBookmark(userId: number, eventId: number): Promise<void> {
  write(userId, read(userId).filter((e) => e.id !== eventId))
}

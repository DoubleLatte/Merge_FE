import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { savePendingBookmark, saveReturnTo, useAuth, useRequireLogin } from '../../auth'
import { useBookmarks, useToggleBookmark } from '../../api/hooks'
import { setLoginPromptEvent } from '../../layout/loginPromptStore'
import type { EventCard } from '../../api/types'

/** 홈 카드/배너 공통 동작: 상세 이동(로그인 필요), 찜 토글(로그인 필요). */
export function useEventActions() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const requireLogin = useRequireLogin()
  const bookmarks = useBookmarks()
  const toggle = useToggleBookmark()
  const liked = useMemo(() => new Set((bookmarks.data ?? []).map((e) => e.id)), [bookmarks.data])

  const openEvent = useCallback(
    (event: EventCard) => {
      const path = `/events/${event.id}`
      if (!isLoggedIn) {
        setLoginPromptEvent(event)
        requireLogin()
        saveReturnTo(path) // 로그인 후 방금 누른 행사로 돌아온다
        return
      }
      navigate(path)
    },
    [isLoggedIn, navigate, requireLogin],
  )

  const toggleLike = useCallback(
    (event: EventCard) => {
      if (!isLoggedIn) {
        setLoginPromptEvent(event)
        savePendingBookmark(event)
      }
      requireLogin(() => toggle.mutate({ event, bookmarked: liked.has(event.id) }))
    },
    [isLoggedIn, requireLogin, toggle, liked],
  )

  return { openEvent, toggleLike, isLiked: (id: number) => liked.has(id) }
}

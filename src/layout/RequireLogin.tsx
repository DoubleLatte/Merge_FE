import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '../components'
import { saveReturnTo, useAuth } from '../auth'

/**
 * 홈과 로그인 화면 밖의 모든 페이지를 막는 라우트 가드.
 * 로그아웃 상태로 들어오면 홈으로 돌려보내고 로그인 유도 모달(A2)을 띄운다.
 * 로그인하면 원래 가려던 경로로 돌아가도록 경로를 저장해 둔다.
 */
export default function RequireLogin() {
  const { isLoggedIn, isLoading, openLoginPrompt } = useAuth()
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (isLoading || isLoggedIn) return
    saveReturnTo(pathname + search)
    openLoginPrompt()
  }, [isLoading, isLoggedIn, pathname, search, openLoginPrompt])

  if (isLoading) return <Spinner />
  if (!isLoggedIn) return <Navigate to="/" replace />
  return <Outlet />
}

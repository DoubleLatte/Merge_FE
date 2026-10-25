import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider, consumeReturnTo, useAuth } from '../auth'
import RequireLogin from './RequireLogin'

function PromptState() {
  const { isLoginPromptOpen } = useAuth()
  return <span>{isLoginPromptOpen ? '모달 열림' : '모달 닫힘'}</span>
}

function setup(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <MemoryRouter initialEntries={[path]}>
          <PromptState />
          <Routes>
            <Route index element={<div>홈 화면</div>} />
            <Route element={<RequireLogin />}>
              <Route path="events" element={<div>행사 목록 화면</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('RequireLogin', () => {
  it('로그아웃 상태로 보호된 경로에 들어가면 홈으로 보내고 로그인 모달을 연다', async () => {
    setup('/events?q=불꽃')
    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
    expect(screen.queryByText('행사 목록 화면')).not.toBeInTheDocument()
    expect(screen.getByText('모달 열림')).toBeInTheDocument()
    // 로그인 후 원래 가려던 경로로 돌아가도록 저장된다
    expect(consumeReturnTo()).toBe('/events?q=불꽃')
  })
})

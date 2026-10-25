import { describe, expect, it } from 'vitest'
import { http } from 'msw'
import { server } from '../mocks/server'
import { fail, ok } from '../mocks/handlers'
import { ApiError, api, buildQuery } from './client'
import { getEvents } from './events'
import { loginWithKakao, logout } from './auth'
import { tokenStorage } from '../auth/tokenStorage'

describe('envelope', () => {
  it('success 응답의 data를 꺼낸다', async () => {
    server.use(http.get('*/api/events/categories', () => ok([{ id: 9, name: 'x', sort_order: 1 }])))
    expect(await api.get('/events/categories')).toEqual([{ id: 9, name: 'x', sort_order: 1 }])
  })
  it('실패 응답을 code/status/errors를 가진 ApiError로 바꾼다', async () => {
    server.use(http.get('*/api/events/5', () => fail(400, 'COMMON_INVALID_INPUT', '잘못됨', { size: ['too big'] })))
    const err = await api.get('/events/5').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 400, code: 'COMMON_INVALID_INPUT', errors: { size: ['too big'] } })
  })
  it('JSON이 아닌 응답도 ApiError', async () => {
    server.use(http.get('*/api/x', () => new Response('boom', { status: 502 })))
    await expect(api.get('/x')).rejects.toMatchObject({ status: 502 })
  })
})

describe('query params', () => {
  it('undefined/null/빈 문자열을 제거한다', () => {
    expect(buildQuery({ a: undefined, b: null, c: '', d: '  ', e: 0, f: false, g: 'x' })).toBe('?e=0&f=false&g=x')
    expect(buildQuery({ a: undefined })).toBe('')
  })
  it('getEvents가 빈 파라미터를 보내지 않는다', async () => {
    let url = ''
    server.use(http.get('*/api/events', ({ request }) => { url = request.url; return ok({ total_count: 0, page: 1, size: 20, events: [] }) }))
    await getEvents({ q: '', tag: undefined, page: 1, sort: 'latest' })
    expect(new URL(url).search).toBe('?page=1&sort=latest')
  })
})

describe('토큰 갱신', () => {
  it('동시 401 AUTH_TOKEN_EXPIRED에서 refresh를 한 번만 보내고 모두 재시도한다', async () => {
    tokenStorage.setTokens({ access_token: 'old', refresh_token: 'r1' })
    let refreshCalls = 0
    server.use(
      http.post('*/api/auth/refresh', async ({ request }) => {
        refreshCalls++
        expect(request.headers.get('authorization')).toBe('Bearer r1')
        await new Promise((r) => setTimeout(r, 30))
        return ok({ access_token: 'new', refresh_token: 'r2' })
      }),
      http.get('*/api/reviews/my', ({ request }) =>
        request.headers.get('authorization') === 'Bearer new' ? ok([]) : fail(401, 'AUTH_TOKEN_EXPIRED')),
      http.get('*/api/events/sidos', ({ request }) =>
        request.headers.get('authorization') === 'Bearer new' ? ok([]) : fail(401, 'AUTH_TOKEN_EXPIRED')),
    )
    const results = await Promise.all([api.get('/reviews/my'), api.get('/events/sidos'), api.get('/reviews/my')])
    expect(results).toEqual([[], [], []])
    expect(refreshCalls).toBe(1)
    expect(tokenStorage.getAccessToken()).toBe('new')
    expect(tokenStorage.getRefreshToken()).toBe('r2')
  })
  it('갱신 실패 시 토큰을 지우고 에러를 던진다', async () => {
    tokenStorage.setTokens({ access_token: 'old', refresh_token: 'r1' })
    server.use(
      http.get('*/api/reviews/my', () => fail(401, 'AUTH_TOKEN_EXPIRED')),
      http.post('*/api/auth/refresh', () => fail(401, 'AUTH_TOKEN_REVOKED')),
    )
    await expect(api.get('/reviews/my')).rejects.toMatchObject({ code: 'AUTH_TOKEN_REVOKED' })
    expect(tokenStorage.getAccessToken()).toBeNull()
    expect(tokenStorage.getRefreshToken()).toBeNull()
  })
  it('재시도는 한 번만 한다', async () => {
    tokenStorage.setTokens({ access_token: 'old', refresh_token: 'r1' })
    let calls = 0
    server.use(
      http.get('*/api/reviews/my', () => { calls++; return fail(401, 'AUTH_TOKEN_EXPIRED') }),
      http.post('*/api/auth/refresh', () => ok({ access_token: 'new', refresh_token: 'r2' })),
    )
    await expect(api.get('/reviews/my')).rejects.toMatchObject({ code: 'AUTH_TOKEN_EXPIRED' })
    expect(calls).toBe(2)
  })
})

describe('auth', () => {
  it('카카오 로그인 시 토큰을 저장한다', async () => {
    server.use(http.post('*/api/auth/kakao', () => ok({ access_token: 'a', refresh_token: 'b', is_new_user: true })))
    const r = await loginWithKakao('code')
    expect(r.is_new_user).toBe(true)
    expect(tokenStorage.getAccessToken()).toBe('a')
  })
  it('logout은 서버가 실패해도 토큰을 지운다', async () => {
    tokenStorage.setTokens({ access_token: 'a', refresh_token: 'b' })
    let body: unknown
    server.use(http.post('*/api/auth/logout', async ({ request }) => { body = await request.json(); return fail(500, 'COMMON_INTERNAL') }))
    await logout()
    expect(body).toEqual({ refresh_token: 'b' })
    expect(tokenStorage.getAccessToken()).toBeNull()
    expect(tokenStorage.getRefreshToken()).toBeNull()
  })
})

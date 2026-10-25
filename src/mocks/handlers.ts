// 테스트 전용 MSW 핸들러. 앱 런타임에서는 사용하지 않는다.
import { http, HttpResponse } from 'msw'

export const ok = <T,>(data: T, status = 200) =>
  HttpResponse.json({ success: true, message: 'ok', data }, { status })
export const fail = (status: number, code: string, message = code, errors?: Record<string, string[]>) =>
  HttpResponse.json({ success: false, code, message, ...(errors ? { errors } : {}) }, { status })

export const handlers = [
  http.get('*/api/events/categories', () => ok([{ id: 1, name: '공연', sort_order: 1 }])),
  http.get('*/api/users/me', () => ok({ id: 1, email: 'a@b.c', nickname: '테스터', profile_image: null })),
]

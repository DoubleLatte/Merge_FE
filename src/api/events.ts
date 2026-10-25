import { api } from './client'
import type {
  Category,
  EventDetail,
  EventListParams,
  EventListResult,
  MonthlyTopResult,
  Sido,
} from './types'

export const getCategories = () => api.get<Category[]>('/events/categories', undefined, { auth: false })
/** JWT 필요 */
export const getSidos = () => api.get<Sido[]>('/events/sidos')
/** 검색 파라미터가 없으면 비로그인도 가능. 토큰이 있으면 자동으로 함께 보낸다. */
export const getEvents = (params: EventListParams = {}) =>
  api.get<EventListResult>('/events', { ...params })
export const getMonthlyTop = (params: { month?: string; size?: number } = {}) =>
  api.get<MonthlyTopResult>('/events/monthly-top', params, { auth: false })
/** JWT 필요 */
export const getEvent = (id: number) => api.get<EventDetail>(`/events/${id}`)

import { api } from './client'
import type { CreateReviewInput, RatingSummary, Review, ReviewInput } from './types'

export const createReview = (input: CreateReviewInput) => api.post<Review>('/reviews', input)
export const getEventReviews = (eventId: number) => api.get<Review[]>(`/reviews/event/${eventId}`)
export const getEventRating = (eventId: number) => api.get<RatingSummary>(`/reviews/event/${eventId}/rating`)
export const getMyReviews = () => api.get<Review[]>('/reviews/my')
export const updateReview = (id: number, input: ReviewInput) => api.put<Review>(`/reviews/${id}`, input)
export const deleteReview = (id: number) => api.delete<unknown>(`/reviews/${id}`)

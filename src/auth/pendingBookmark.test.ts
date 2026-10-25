import { describe, expect, it } from 'vitest'
import { clearPendingBookmark, consumePendingBookmark, savePendingBookmark } from './kakao'

describe('pending bookmark', () => {
  it('저장한 찜은 한 번만 꺼낼 수 있다', () => {
    savePendingBookmark({ id: 7 })
    expect(consumePendingBookmark()).toEqual({ id: 7 })
    expect(consumePendingBookmark()).toBeNull()
  })

  it('clear하면 꺼낼 게 없다', () => {
    savePendingBookmark({ id: 7 })
    clearPendingBookmark()
    expect(consumePendingBookmark()).toBeNull()
  })
})

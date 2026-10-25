import { useState } from 'react'
import { SearchIcon } from '../../components/icons'

/** B1 큰 검색창 */
export function EventSearchBar({ value, onSubmit }: { value: string; onSubmit: (q: string) => void }) {
  const [text, setText] = useState(value)
  const [prev, setPrev] = useState(value)
  if (prev !== value) {
    setPrev(value)
    setText(value)
  }
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(text.trim())
      }}
      className="flex h-[54px] items-center gap-3 rounded-pill border-2 border-ink bg-surface pl-[18px] pr-[6px]"
    >
      <SearchIcon className="shrink-0 text-ink" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="행사명, 장소, 태그로 검색"
        aria-label="행사 검색"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-subtle"
      />
      <button type="submit" aria-label="검색" className="flex size-[42px] items-center justify-center rounded-full bg-brand text-white">
        <SearchIcon />
      </button>
    </form>
  )
}

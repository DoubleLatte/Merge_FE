import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  selected?: boolean
  onClick?: () => void
  children: ReactNode
}

/** 지역/필터 선택용 알약 칩 (34px) */
export function Chip({ selected = false, onClick, children, className = '', ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-[34px] shrink-0 items-center rounded-pill border px-[14px] text-[13px] leading-[19.5px] ${
        selected
          ? 'border-primary-border bg-primary-tint-strong font-bold text-primary-ink'
          : 'border-line bg-surface font-normal text-ink-muted'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export const FilterChip = Chip

export interface TagProps {
  tone?: 'brand' | 'neutral'
  children: ReactNode
}

/** 상세 상단 등에 쓰는 작은 정보 태그 (축제 / 충남 천안시 / 진행 중) */
export function Tag({ tone = 'neutral', children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] px-2 py-[3px] text-[12px] font-bold leading-[18px] ${
        tone === 'brand' ? 'bg-primary-tint text-primary-ink' : 'bg-surface-muted text-ink'
      }`}
    >
      {children}
    </span>
  )
}

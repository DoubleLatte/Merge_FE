import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons'

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** 접근성 이름 (aria-label). title 이 있으면 생략 가능 */
  ariaLabel?: string
  /** 상단 그라데이션 영역 (A2 로그인 안내처럼). 없으면 일반 다이얼로그 */
  hero?: ReactNode
  /** 제목(중앙 정렬 큰 글씨) */
  title?: ReactNode
  children?: ReactNode
  /** 배경 클릭으로 닫기 (기본 true) */
  closeOnBackdrop?: boolean
}

export function Modal({
  open,
  onClose,
  ariaLabel,
  hero,
  title,
  children,
  closeOnBackdrop = true,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className="relative max-h-full w-full max-w-[440px] overflow-y-auto rounded-xl bg-surface shadow-dialog outline-none"
      >
        {hero && <div className="relative">{hero}</div>}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={`absolute right-[14px] top-[14px] z-10 flex size-[34px] items-center justify-center rounded-full ${
            hero ? 'bg-black/25 text-white' : 'bg-surface-muted text-ink-muted'
          }`}
        >
          <CloseIcon size={20} />
        </button>
        <div className="px-[26px] pb-[22px] pt-6">
          {title && (
            <h2 className="text-center text-[22px] font-black leading-[29.7px] tracking-[-0.44px] text-ink">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

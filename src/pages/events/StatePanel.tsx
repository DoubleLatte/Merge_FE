import type { ReactNode } from 'react'

/** B2(결과 없음)·B5·B6(불러오기 실패) 공통: 틴트 아이콘 상자 + 제목 + 설명 + 버튼 */
export function StatePanel({
  icon,
  title,
  message,
  action,
  role,
}: {
  icon: ReactNode
  title: string
  message?: ReactNode
  action?: ReactNode
  role?: 'alert' | 'status'
}) {
  return (
    <div role={role} className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-[60px] items-center justify-center rounded-[20px] bg-primary-tint text-primary-ink">
        {icon}
      </span>
      <h2 className="pt-[18px] text-[18px] font-black leading-[27px] text-ink">{title}</h2>
      {message && <p className="pt-[6px] text-[13px] leading-[19.5px] text-ink-muted">{message}</p>}
      {action && <div className="pt-5">{action}</div>}
    </div>
  )
}

export const primaryBtn =
  'inline-flex h-[44px] items-center rounded-card bg-primary px-[18px] text-[14px] font-bold text-white'
export const outlineBtn =
  'inline-flex h-[44px] items-center rounded-card border border-line bg-surface px-[18px] text-[14px] font-bold text-ink'

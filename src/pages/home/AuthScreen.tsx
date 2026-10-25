import type { ReactNode } from 'react'

/** 로그인 계열 화면은 헤더/푸터 없이 전체 화면으로 보여준다 (Figma A3~A7). */
export function AuthScreen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`fixed inset-0 z-40 overflow-auto bg-surface ${className}`}>{children}</div>
}

export function Wordmark({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <p
      className={`text-center font-display font-black text-brand ${className}`}
      style={{ fontSize: size, lineHeight: `${size}px`, letterSpacing: `${-size * 0.045}px` }}
    >
      meoji
    </p>
  )
}

export const centerBg = 'bg-gradient-to-b from-[#fff6f2] to-white to-60%'

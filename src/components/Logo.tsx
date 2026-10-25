export interface LogoProps {
  /** 글자 크기(px). 헤더 31, 푸터 24 */
  size?: number
  className?: string
}

export function Logo({ size = 31, className = '' }: LogoProps) {
  return (
    <span
      className={`font-display font-black text-brand whitespace-nowrap ${className}`}
      style={{ fontSize: size, lineHeight: 1, letterSpacing: `${-0.05 * size}px` }}
    >
      meoji
    </span>
  )
}

import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
function svg({ size = 16, ...rest }: P): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...rest,
  }
}

export const ListIcon = (p: P) => (
  <svg {...svg(p)}>
    <path d="M5.5 4H13M5.5 8H13M5.5 12H13M2.8 4H3M2.8 8H3M2.8 12H3" />
  </svg>
)
export const CalendarSmallIcon = (p: P) => (
  <svg {...svg(p)}>
    <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
    <path d="M2.5 6.5H13.5M5.5 2V4.5M10.5 2V4.5" />
  </svg>
)
export const MapSmallIcon = (p: P) => (
  <svg {...svg(p)}>
    <path d="M2 4L5.5 2.5L10.5 4.5L14 3V12L10.5 13.5L5.5 11.5L2 13V4ZM5.5 2.5V11.5M10.5 4.5V13.5" />
  </svg>
)
export const ChevronLeftIcon = (p: P) => (
  <svg {...svg(p)}>
    <path d="M10 3.5L5.5 8L10 12.5" />
  </svg>
)
export const ChevronRightIcon = (p: P) => (
  <svg {...svg(p)}>
    <path d="M6 3.5L10.5 8L6 12.5" />
  </svg>
)
export const HeartOutlineIcon = (p: P) => (
  <svg {...svg(p)}>
    <path d="M8 13C8 13 2.5 9.8 2.5 6C2.5 4.3 3.8 3 5.4 3C6.5 3 7.5 3.6 8 4.6C8.5 3.6 9.5 3 10.6 3C12.2 3 13.5 4.3 13.5 6C13.5 9.8 8 13 8 13Z" />
  </svg>
)
export const WifiOffIcon = ({ size = 24, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 24 24" strokeWidth={1.8}>
    <path d="M3 3L21 21M8.5 16.4C10.5 14.9 13.5 14.9 15.5 16.4M5 12.9C6.1 12 7.3 11.4 8.6 11M19 12.9C18.2 12.2 17.3 11.7 16.3 11.3M2 8.8C3.6 7.4 5.4 6.5 7.3 6M22 8.8C19.8 6.9 17 5.8 14 5.6M12 20H12.01" />
  </svg>
)
export const SearchBigIcon = ({ size = 24, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 24 24" strokeWidth={1.8}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20L15.8 15.8" />
  </svg>
)
export const PinBigIcon = ({ size = 24, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 24 24" strokeWidth={1.8}>
    <path d="M12 21C12 21 19 14.8 19 9.5C19 5.6 15.9 2.5 12 2.5C8.1 2.5 5 5.6 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
export const LocateIcon = ({ size = 18, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 18 18" strokeWidth={1.5}>
    <circle cx="9" cy="9" r="3.5" />
    <path d="M9 1.5V4M9 14V16.5M1.5 9H4M14 9H16.5" />
  </svg>
)
export const PlusIcon = ({ size = 18, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 18 18" strokeWidth={1.5}>
    <path d="M9 3.5V14.5M3.5 9H14.5" />
  </svg>
)
export const MinusIcon = ({ size = 18, ...p }: P) => (
  <svg {...svg({ size, ...p })} viewBox="0 0 18 18" strokeWidth={1.5}>
    <path d="M3.5 9H14.5" />
  </svg>
)

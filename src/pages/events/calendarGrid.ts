import type { EventCard } from '../../api/types'

export interface DayCell {
  date: string // YYYY-MM-DD
  day: number
  inMonth: boolean
}
export interface Segment {
  event: EventCard
  /** 주 안에서의 시작/끝 열 (0=일 ... 6=토) */
  startCol: number
  endCol: number
  lane: number
  /** 이벤트가 이 주에서 실제로 시작/끝나는지 (둥근 모서리 표시용) */
  startsHere: boolean
  endsHere: boolean
}
export interface Week {
  days: DayCell[]
  segments: Segment[]
  lanes: number
}

const pad = (n: number) => String(n).padStart(2, '0')
export const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`
const dayNum = (s: string) => {
  const [y, m, d] = s.slice(0, 10).split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86400000)
}
const fromDayNum = (n: number) => {
  const dt = new Date(n * 86400000)
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() }
}

/** 이벤트가 [monthStart, monthEnd] 범위와 겹치는지. 종료일이 없으면 시작일 하루. */
export function eventRange(e: EventCard): [number, number] | null {
  if (!e.start_date) return null
  const s = dayNum(e.start_date)
  const en = e.end_date ? Math.max(s, dayNum(e.end_date)) : s
  return [s, en]
}

export function eventsInMonth(events: EventCard[], year: number, month: number): EventCard[] {
  const a = dayNum(ymd(year, month, 1))
  const b = dayNum(ymd(year, month, new Date(Date.UTC(year, month, 0)).getUTCDate()))
  return events.filter((e) => {
    const r = eventRange(e)
    return r && r[0] <= b && r[1] >= a
  })
}

/** 일요일 시작 월간 그리드(주 단위). 각 주에 이벤트 막대와 레인을 배치한다. */
export function buildMonth(year: number, month: number, events: EventCard[]): Week[] {
  const first = dayNum(ymd(year, month, 1))
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const last = dayNum(ymd(year, month, lastDay))
  const gridStart = first - new Date(first * 86400000).getUTCDay()
  const gridEnd = last + (6 - new Date(last * 86400000).getUTCDay())
  const ranged = events
    .map((e) => ({ e, r: eventRange(e) }))
    .filter((x): x is { e: EventCard; r: [number, number] } => !!x.r)
    .sort((a, b) => a.r[0] - b.r[0] || b.r[1] - b.r[0] - (a.r[1] - a.r[0]) || a.e.id - b.e.id)

  const weeks: Week[] = []
  for (let ws = gridStart; ws <= gridEnd; ws += 7) {
    const days: DayCell[] = []
    for (let i = 0; i < 7; i++) {
      const { y, m, d } = fromDayNum(ws + i)
      days.push({ date: ymd(y, m, d), day: d, inMonth: y === year && m === month })
    }
    const we = ws + 6
    const laneEnds: number[] = []
    const segments: Segment[] = []
    for (const { e, r } of ranged) {
      if (r[0] > we || r[1] < ws) continue
      const startCol = Math.max(r[0], ws) - ws
      const endCol = Math.min(r[1], we) - ws
      let lane = laneEnds.findIndex((end) => end < startCol)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(endCol)
      } else laneEnds[lane] = endCol
      segments.push({ event: e, startCol, endCol, lane, startsHere: r[0] >= ws, endsHere: r[1] <= we })
    }
    weeks.push({ days, segments, lanes: laneEnds.length })
  }
  return weeks
}

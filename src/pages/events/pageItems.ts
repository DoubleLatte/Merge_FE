/** 1 2 3 ... N 형태의 페이지 번호 목록. 현재 페이지 주변 2칸 + 처음/끝. */
export function pageItems(page: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, page - 1, page, page + 1])
  if (page <= 3) [2, 3, 4, 5].forEach((n) => set.add(n))
  if (page >= total - 2) [total - 4, total - 3, total - 2].forEach((n) => set.add(n))
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: Array<number | 'gap'> = []
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('gap')
    out.push(n)
  })
  return out
}


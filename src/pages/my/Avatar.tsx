export function Avatar({ name, src, size }: { name: string; src?: string | null; size: number }) {
  const initial = name.trim().charAt(0) || '?'
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-tint font-bold text-primary-ink"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initial}
    </span>
  )
}

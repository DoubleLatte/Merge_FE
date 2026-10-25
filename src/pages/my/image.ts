const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_EDGE = 256

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('사진을 불러오지 못했어요'))
    r.readAsDataURL(file)
  })
}

/**
 * MOCK 프로필 사진: 로컬 파일을 data URL 로 변환한다(localStorage 용량을 위해 256px 로 축소 시도).
 * BE 업로드 API 가 생기면 이 함수 대신 업로드 후 URL 을 쓴다.
 */
export async function readImageAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일만 선택할 수 있어요')
  if (file.size > MAX_FILE_BYTES) throw new Error('5MB 이하의 사진을 선택해 주세요')
  const raw = await readAsDataUrl(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = raw
    })
    const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * scale))
    canvas.height = Math.max(1, Math.round(img.height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) return raw
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.85)
  } catch {
    return raw.length < 400_000 ? raw : Promise.reject(new Error('사진을 처리하지 못했어요'))
  }
}

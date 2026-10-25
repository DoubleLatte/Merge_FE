import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useUpdateProfile } from '../api/hooks'
import { useToast } from '../components'
import { Avatar } from './my/Avatar'
import { LoginRequired } from './my/LoginRequired'
import { readImageAsDataUrl } from './my/image'

export const NICKNAME_MIN = 2
export const NICKNAME_MAX = 10

function Form() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const update = useUpdateProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [photo, setPhoto] = useState<string | null>(user?.profile_image ?? null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  if (!user) return null
  const trimmed = nickname.trim()
  const nicknameError =
    trimmed.length < NICKNAME_MIN ? `이름은 ${NICKNAME_MIN}자 이상이어야 해요` : ''
  const dirty = trimmed !== user.nickname || photo !== (user.profile_image ?? null)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    setMenuOpen(false)
    if (!file) return
    try {
      setPhoto(await readImageAsDataUrl(file))
      setPhotoError('')
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : '사진을 불러오지 못했어요')
    }
  }

  const save = () => {
    if (nicknameError) return
    // MOCK: BE 에 프로필 수정 API 가 없어 localStorage 에만 저장된다.
    update.mutate(
      { nickname: trimmed, profile_image: photo },
      {
        onSuccess: () => {
          toast.show({ message: '프로필을 저장했어요' })
          navigate('/my/bookmarks')
        },
      },
    )
  }

  return (
    <div className="mx-auto w-full max-w-[460px] rounded-[22px] border border-line bg-surface px-8 py-9">
      <h1 className="text-[24px] font-black leading-9 tracking-[-0.48px] text-ink">프로필 편집</h1>
      <p className="pt-1 text-[14px] leading-[21px] text-ink-muted">다른 사람에게 보이는 이름과 사진이에요</p>

      <div className="flex justify-center pt-6">
        <div className="relative size-[104px]">
          <Avatar name={nickname || user.nickname} src={photo} size={104} />
          <button
            type="button"
            aria-label="프로필 사진 변경"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="absolute left-[70px] top-[70px] flex size-[34px] items-center justify-center rounded-full border-[3px] border-white bg-ink text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute left-[70px] top-[110px] z-10 w-[155px] rounded-[12px] border border-line bg-surface py-1 text-[13px] shadow-float"
            >
              <button role="menuitem" type="button" className="block w-full px-4 py-[9px] text-left text-ink" onClick={() => fileRef.current?.click()}>
                앨범에서 선택
              </button>
              <button role="menuitem" type="button" className="block w-full px-4 py-[9px] text-left text-ink" onClick={() => cameraRef.current?.click()}>
                사진 촬영
              </button>
              <button
                role="menuitem"
                type="button"
                className="block w-full px-4 py-[9px] text-left text-primary-ink"
                onClick={() => {
                  setPhoto(null)
                  setMenuOpen(false)
                }}
              >
                기본 이미지로 변경
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden data-testid="photo-input" onChange={onFile} />
          <input ref={cameraRef} type="file" accept="image/*" capture="user" hidden onChange={onFile} />
        </div>
      </div>
      {photoError && (
        <p role="alert" className="pt-2 text-center text-[12px] text-primary-ink">
          {photoError}
        </p>
      )}

      <div className="pt-[26px]">
        <div className="flex justify-between text-[13px] leading-[19.5px]">
          <label htmlFor="nickname" className="font-bold text-ink">
            이름
          </label>
          <span className="text-ink-subtle">
            {nickname.length}/{NICKNAME_MAX}
          </span>
        </div>
        <input
          id="nickname"
          value={nickname}
          maxLength={NICKNAME_MAX}
          onChange={(e) => setNickname(e.target.value)}
          aria-invalid={!!nicknameError}
          className="mt-[6px] h-12 w-full rounded-[12px] border-2 border-ink px-[14px] text-[15px] text-ink outline-none"
        />
        {nicknameError && (
          <p role="alert" className="pt-[6px] text-[12px] text-primary-ink">
            {nicknameError}
          </p>
        )}
      </div>

      <div className="pt-[18px]">
        <label htmlFor="email" className="text-[13px] font-bold leading-[19.5px] text-ink">
          이메일
        </label>
        <input
          id="email"
          readOnly
          value={user.email ?? ''}
          className="mt-[6px] h-12 w-full rounded-[12px] border border-line bg-surface-muted px-[14px] text-[15px] text-ink-muted outline-none"
        />
        <p className="pt-[6px] text-[12px] leading-[18px] text-ink-subtle">카카오 계정 이메일은 바꿀 수 없어요.</p>
      </div>

      {update.isError && (
        <p role="alert" className="pt-3 text-[13px] text-primary-ink">
          저장하지 못했어요. 잠시 후 다시 시도해 주세요
        </p>
      )}
      <div className="flex gap-2 pt-[26px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-11 flex-1 rounded-[12px] border border-line text-[14px] font-bold text-ink"
        >
          취소
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!!nicknameError || !dirty || update.isPending}
          className="h-11 flex-1 rounded-[12px] bg-primary text-[14px] font-bold text-white disabled:opacity-40"
        >
          저장
        </button>
      </div>
    </div>
  )
}

export default function MyProfile() {
  return (
    <div className="px-6 pb-5 pt-[60px]">
      <LoginRequired>
        <Form />
      </LoginRequired>
    </div>
  )
}

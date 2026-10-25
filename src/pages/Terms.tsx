import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { consumeReturnTo, useAuth } from '../auth'
import { useToast } from '../components'
import { CheckIcon } from '../components/icons'
import { AuthScreen, centerBg } from './home/AuthScreen'

function Box({ checked, large }: { checked: boolean; large?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
        checked ? 'bg-brand text-white' : 'border border-ink-disabled text-transparent'
      }`}
    >
      <CheckIcon size={large ? 14 : 14} />
    </span>
  )
}

/** A7: 최초 로그인 시에만. BE에 동의 저장 API가 없어 화면만 보여주고 이어서 진행한다. */
export default function Terms() {
  const { isLoggedIn, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [service, setService] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const all = service && privacy

  if (!isLoading && !isLoggedIn) return <Navigate to="/auth/login" replace />

  const toggleAll = () => {
    setService(!all)
    setPrivacy(!all)
  }
  const start = () => {
    navigate(consumeReturnTo() || '/', { replace: true })
    toast.show({ message: '머지에 오신 걸 환영해요!' })
  }
  const cancel = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const row = (label: string, checked: boolean, onToggle: () => void) => (
    <div className="flex items-center gap-3 px-4 py-[14px]">
      <button type="button" role="checkbox" aria-checked={checked} onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
        <Box checked={checked} />
        <span className="text-[14px] leading-[21px] text-ink">{label}</span>
      </button>
      <button type="button" className="text-[12px] leading-[18px] text-ink-subtle underline">
        보기
      </button>
    </div>
  )

  return (
    <AuthScreen className={centerBg}>
      <div className="flex min-h-full items-center justify-center px-4 py-10">
        <div className="w-[460px] max-w-full rounded-[22px] border border-line bg-surface px-8 py-9">
          <h1 className="text-[24px] font-black leading-9 tracking-[-0.48px] text-ink">거의 다 됐어요!</h1>
          <p className="pt-1 text-[14px] leading-[21px] text-ink-muted">머지를 시작하려면 아래 약관에 동의해 주세요</p>
          <button
            type="button"
            role="checkbox"
            aria-checked={all}
            onClick={toggleAll}
            className="mt-6 flex w-full items-center gap-3 rounded-[14px] bg-surface-card p-4 text-left"
          >
            <Box checked={all} large />
            <span className="text-[16px] font-black leading-6 text-ink">전체 동의</span>
          </button>
          {row('[필수] 서비스 이용약관 동의', service, () => setService(!service))}
          {row('[필수] 개인정보 수집 및 이용 동의', privacy, () => setPrivacy(!privacy))}
          <div className="flex gap-2 pt-[26px]">
            <button
              type="button"
              onClick={() => void cancel()}
              className="h-11 flex-1 rounded-card border border-line bg-surface text-[14px] font-bold text-ink"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!all}
              onClick={start}
              className="h-11 flex-1 rounded-card bg-primary text-[14px] font-bold text-white disabled:opacity-40"
            >
              동의하고 시작하기
            </button>
          </div>
        </div>
      </div>
    </AuthScreen>
  )
}

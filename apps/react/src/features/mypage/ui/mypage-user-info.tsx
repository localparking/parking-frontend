import KakaoIcon from '@/assets/icons/kakao-logo.svg'
import AppleIcon from '@/assets/icons/apple-logo.svg'
import { UserRound } from 'lucide-react'

type User = {
  nickname: string | null
  provider: 'kakao' | 'apple'
}

type MyPageUserInfoProps = {
  isLoggedIn: boolean
  user?: User
  onLoginClick: () => void
  onLogoutClick: () => void
  onProfileClick: () => void
}

export function MyPageUserInfo({ isLoggedIn, user, onLoginClick, onLogoutClick, onProfileClick }: MyPageUserInfoProps) {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className={`flex cursor-pointer items-center gap-2`} onClick={isLoggedIn ? onProfileClick : onLoginClick}>
          {isLoggedIn ? (
            user?.provider === 'kakao' ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE600]">
                <KakaoIcon className="h-4 w-4" />
              </div>
            ) : (
              <AppleIcon />
            )
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-4">
              <UserRound className="h-5 w-5 text-gray-3" />
            </div>
          )}
          <span className="text-body-6 text-gray-1">
            {isLoggedIn ? user?.nickname || '사용자' : '로그인・회원가입 하기'}
          </span>
        </div>

        {isLoggedIn && (
          <button
            onClick={onLogoutClick}
            className="h-5 w-12 rounded-[50px] bg-gray-4 px-2 py-0.5 text-caption-4 whitespace-nowrap text-gray-2"
          >
            로그아웃
          </button>
        )}
      </div>
    </div>
  )
}

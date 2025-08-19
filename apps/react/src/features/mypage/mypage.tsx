import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import userService from '@/shared/services/user.service'
import { MyPageMenuItem, MyPageUserInfo } from '@/features/mypage/ui'
import { MyPageHeader } from '@/shared/ui'

export function MyPageMain() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { open } = useAlertDialog()

  const menuItems = [
    { title: '문의하기', description: '문의하기 기능은 준비 중입니다.' },
    { title: '서비스 이용약관', description: '서비스 이용약관 기능은 준비 중입니다.' },
    { title: '개인정보 처리방침', description: '개인정보 처리방침 기능은 준비 중입니다.' },
  ]

  const handleLogout = () => {
    open({
      title: '로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
      onConfirm: () => {
        logout()
        navigate({ to: '/login', replace: true })
      },
    })
  }

  const handleWithdraw = () => {
    open({
      title: '정말 계정을 탈퇴 하시겠습니까?',
      description: '탈퇴시 모든 기록이 삭제되며 \n 해당 작업은 복구할 수 없습니다.',
      confirmText: '탈퇴하기',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await userService.withdraw()
          logout()
          navigate({ to: '/login', replace: true })
        } catch (error) {
          open({
            title: '탈퇴 실패',
            description: '회원 탈퇴 처리 중 오류가 발생했습니다. \n 잠시 후 다시 시도해주세요.',
            confirmText: '확인',
          })
        }
      },
    })
  }

  return (
    <div className="flex flex-col">
      <MyPageHeader title="마이 페이지" onClick={() => navigate({ to: '..' })} />
      <div className="flex flex-col gap-3 p-6">
        {/* 유저 정보 */}
        <MyPageUserInfo
          isLoggedIn={!!user}
          user={user ? { nickname: user.nickname, provider: 'kakao' as const } : undefined}
          onLoginClick={() => navigate({ to: '/login' })}
          onLogoutClick={handleLogout}
          onProfileClick={() => navigate({ to: '/mypage/profile' })}
        />
        <div className="h-px w-full bg-gray-3" />

        {/* 메뉴 아이템 */}
        {menuItems.map((item) => (
          <MyPageMenuItem
            key={item.title}
            title={item.title}
            onClick={() => {
              open({
                title: item.title,
                description: item.description,
                confirmText: '확인',
              })
            }}
          />
        ))}

        {/* 회원 탈퇴 */}
        {user && (
          <div className="flex flex-col items-end">
            <button
              onClick={handleWithdraw}
              className="font-caption-4 rounded-[50px] px-2 py-1 text-[10px] text-gray-3 underline"
            >
              회원 탈퇴하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

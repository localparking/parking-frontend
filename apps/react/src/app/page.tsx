import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div>HomePage</div>

      {/* todo: 온보딩 기능 구현 완료 후 테스트 버튼 삭제 */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Link to="/onboarding/landing">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">온보딩 플로우 테스트하기</Button>
        </Link>
        <Link to="/debug">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">디버그페이지</Button>
        </Link>
      </div>
    </div>
  )
}

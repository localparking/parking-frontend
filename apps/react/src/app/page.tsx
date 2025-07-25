import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Link to="/login">
        <Button>로그인</Button>
      </Link>
      <div>HomePage</div>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { MyPageProfile } from '@/features/profile'

export const Route = createFileRoute('/mypage/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyPageProfile />
}

import { createFileRoute } from '@tanstack/react-router'
import { MyPageMain } from '@/features/mypage'

export const Route = createFileRoute('/mypage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyPageMain />
}

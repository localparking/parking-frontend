import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
  beforeLoad: () => {
    throw redirect({ to: '/map' })
  },
})

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div>HomePage</div>
    </div>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@ui/common/components/button'
import z from 'zod'

export const Route = createFileRoute('/camera/')({
  component: Camera,
  loaderDeps: (search) => search,
  loader: async ({ context, deps }) => {
    return {
      data: deps.search,
      // data: await bannedWordService.findAll(deps.search),
    }
  },
})

function Camera() {
  return (
    <div className="m-auto text-2xl font-bold">
      <a href="https://townparking.store/oauth2/authorization/kakao">
        <Button onClick={() => {}}>카카오톡으로 로그인</Button>
      </a>
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import Button from './button'

export function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F4F8FF] to-white px-6 py-12">
      <div className="absolute inset-x-0 bottom-[-30%] h-[420px] bg-[radial-gradient(circle_at_center,_rgba(65,105,225,0.08),_transparent_65%)]" />

      <div className="z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-1/10">
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="h-12 w-12 text-primary-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 6c-10.493 0-19 8.507-19 19 0 14.25 19 33 19 33s19-18.75 19-33c0-10.493-8.507-19-19-19Zm0 25a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
              fill="currentColor"
            />
            <path
              d="M32 2C18.745 2 8 12.745 8 26c0 8.533 5.905 18.684 11.762 26.56a206.664 206.664 0 0 0 9.984 12.08 3 3 0 0 0 4.508 0 206.664 206.664 0 0 0 9.984-12.08C50.095 44.684 56 34.533 56 26 56 12.745 45.255 2 32 2Zm0 52.88C25.813 49.383 14 34.45 14 26 14 16.058 22.058 8 32 8s18 8.058 18 18c0 8.45-11.813 23.383-18 28.88Z"
              fill="currentColor"
              opacity={0.3}
            />
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-[52px] leading-none font-bold text-primary-2">404</p>
          <p className="text-gray-5 text-body-3">찾으시는 페이지가 사라졌거나 이동되었어요.</p>
        </div>

        <div className="mt-10 w-full space-y-4">
          <Link to="/map" className="block">
            <Button className="h-12">홈으로 이동</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

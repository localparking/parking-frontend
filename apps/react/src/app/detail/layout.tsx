import { CartProvider } from '@/features/store/context/cart-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/detail')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  )
}

import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/shared/utils'
import { ProductResponseDto } from '@data/user-api-axios/api'
import { useCart } from '@/features/store/context/cart-context'

interface ProductItemProps {
  product: ProductResponseDto
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { handleUpdateCart, findItemInCart } = useCart()
  const cartItem = findItemInCart(product.productId)
  const quantity = cartItem?.quantity ?? 0

  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="min-w-0 flex-1 space-y-2.5 py-3">
        <h2 className="truncate text-body-4">{product.name}</h2>
        <p className="text-caption-2 text-gray-2">{product.description}</p>
        <p className="text-caption-1">{formatPrice(product.price)}</p>
      </div>

      <div className="w-24 flex-shrink-0 space-y-2">
        <div className="relative flex h-20 w-24 items-center justify-center rounded-[5px]">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-[5px] object-cover" />

          {!cartItem && (
            <button
              onClick={() => handleUpdateCart(product.productId, 1)}
              className="absolute right-0 -bottom-4 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]"
              aria-label={`${product.name} 장바구니에 추가`}
            >
              <Plus className="h-4.5 w-4.5 text-gray-2" />
            </button>
          )}

          {cartItem && (
            <div className="absolute -bottom-6 flex w-full items-center justify-between rounded-[5px] bg-white px-1.5 py-1 shadow-[0_0_4px_rgba(0,0,0,0.25)]">
              <button
                onClick={() => handleUpdateCart(product.productId, quantity - 1)}
                className="flex items-center justify-center text-gray-2"
                aria-label={`${product.name} 수량 감소 또는 제거`}
              >
                {quantity > 1 ? <Minus className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </button>
              <p className="text-body-5 select-none">{quantity}</p>
              <button
                onClick={() => handleUpdateCart(product.productId, quantity + 1)}
                className="flex items-center justify-center text-gray-2"
                aria-label={`${product.name} 수량 증가`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

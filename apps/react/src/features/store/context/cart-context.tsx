import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { ParkingBenefitDto, ProductResponseDto } from '@data/user-api-axios/api'

// --- 타입 정의 ---
export interface CartItem {
  productId: number
  quantity: number
}

interface ParkingBenefitInfo {
  currentBenefit: ParkingBenefitDto | null
  nextBenefit: ParkingBenefitDto | null
  remainingForNext: number
}

interface CartContextType {
  cart: CartItem[]
  handleUpdateCart: (productId: number, newQuantity: number) => void
  findItemInCart: (productId: number) => CartItem | undefined
  totalQuantity: number
  totalPrice: number
  parkingBenefitInfo: ParkingBenefitInfo
  setStoreContext: (products: ProductResponseDto[], benefits: ParkingBenefitDto[]) => void
  clearCart: () => void
}

// --- Context 생성 ---
const CartContext = createContext<CartContextType | undefined>(undefined)

// --- Provider 컴포넌트 ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<ProductResponseDto[]>([])
  const [benefits, setBenefits] = useState<ParkingBenefitDto[]>([])

  const findItemInCart = (productId: number) => cart.find((item) => item.productId === productId)

  const handleUpdateCart = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId))
    } else {
      const existingItem = findItemInCart(productId)
      if (existingItem) {
        setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item)))
      } else {
        setCart([...cart, { productId, quantity: newQuantity }])
      }
    }
  }

  const clearCart = () => setCart([])

  const { totalQuantity, totalPrice, parkingBenefitInfo } = useMemo(() => {
    const productsById = new Map(products.map((p) => [p.productId, p]))
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPr = cart.reduce((sum, item) => {
      const product = productsById.get(item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    const sortedBenefits = [...benefits].sort((a, b) => a.purchaseAmount - b.purchaseAmount)
    let currentBenefit: ParkingBenefitDto | null = null
    let nextBenefit: ParkingBenefitDto | null = null
    let remainingForNext = 0

    for (const benefit of sortedBenefits) {
      if (totalPr >= benefit.purchaseAmount) {
        currentBenefit = benefit
      } else {
        nextBenefit = benefit
        break
      }
    }

    if (nextBenefit) {
      remainingForNext = nextBenefit.purchaseAmount - totalPr
    }

    return {
      totalQuantity: totalQty,
      totalPrice: totalPr,
      parkingBenefitInfo: {
        currentBenefit,
        nextBenefit,
        remainingForNext,
      },
    }
  }, [cart, products, benefits])

  const setStoreContext = (products: ProductResponseDto[], benefits: ParkingBenefitDto[]) => {
    setProducts(products)
    setBenefits(benefits)
  }

  const value = {
    cart,
    handleUpdateCart,
    findItemInCart,
    totalQuantity,
    totalPrice,
    parkingBenefitInfo,
    setStoreContext,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// --- Custom Hook ---
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

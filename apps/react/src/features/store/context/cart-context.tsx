import { createContext, useContext, useState, ReactNode } from 'react'

// --- 타입 정의 ---
export interface CartItem {
  productId: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  handleUpdateCart: (productId: number, newQuantity: number) => void
  findItemInCart: (productId: number) => CartItem | undefined
  clearCart: () => void
}

// --- Context 생성 ---
const CartContext = createContext<CartContextType | undefined>(undefined)

// --- Provider 컴포넌트 ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const findItemInCart = (productId: number) => cart.find((item) => item.productId === productId)

  const handleUpdateCart = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
    } else {
      const existingItem = findItemInCart(productId)
      if (existingItem) {
        setCart((prevCart) =>
          prevCart.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
        )
      } else {
        setCart((prevCart) => [...prevCart, { productId, quantity: newQuantity }])
      }
    }
  }

  const clearCart = () => setCart([])

  const value = {
    cart,
    handleUpdateCart,
    findItemInCart,
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

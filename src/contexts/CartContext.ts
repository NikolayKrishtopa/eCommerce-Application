import { createContext } from 'react'
import useCart from '@/hooks/useCart'

const CartContext = createContext<null | ReturnType<typeof useCart>>(null)

export default CartContext

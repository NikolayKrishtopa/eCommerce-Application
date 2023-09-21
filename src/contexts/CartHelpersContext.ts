import { createContext } from 'react'
import useCart from '@/hooks/useCart'
import makeProtectedUseContext from './_/makeProtectedUseContext'

const CartHelpersContext = createContext<
  ReturnType<typeof useCart> | undefined
>(undefined)

const useCartHelpers = makeProtectedUseContext(CartHelpersContext)

export default CartHelpersContext
export { useCartHelpers }

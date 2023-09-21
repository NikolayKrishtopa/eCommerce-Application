import { createContext } from 'react'
import { type Cart } from '@commercetools/platform-sdk'

const CurrentCartContext = createContext<Cart | undefined>(undefined)

export default CurrentCartContext

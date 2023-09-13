import { createContext } from 'react'
import { ProductProjection } from '@commercetools/platform-sdk'

const ProductsContext = createContext<null | ProductProjection[]>(null)

export default ProductsContext

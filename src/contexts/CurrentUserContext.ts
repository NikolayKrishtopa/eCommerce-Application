import { createContext } from 'react'
import { Customer } from '@commercetools/platform-sdk'

const CurrentUserContext = createContext<null | Customer>(null)

export default CurrentUserContext

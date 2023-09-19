import { createContext } from 'react'
import { Customer } from '@commercetools/platform-sdk'

const CurrentUserContext = createContext<Customer | undefined>(undefined)

export default CurrentUserContext

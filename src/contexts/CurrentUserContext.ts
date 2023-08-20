import { createContext } from 'react'
import { UserLoggedIn } from '@/Models/Models'

const CurrentUserContext = createContext<null | UserLoggedIn>(null)

export default CurrentUserContext

import { createContext } from 'react'
import { SessionType } from '@/hooks/useAuth'

const SessionContext = createContext<{
  isAuthenticated: boolean
  sessionState: SessionType
}>({
  sessionState: SessionType.Client,
  isAuthenticated: false,
})

export default SessionContext

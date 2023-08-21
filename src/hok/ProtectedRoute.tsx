import { useNavigate } from 'react-router-dom'
import { ProtectedRouteProps } from './ProtectedRoute.props'

function ProtectedRoute(props: ProtectedRouteProps) {
  const { condition, children } = props

  const navigate = useNavigate()

  if (condition) {
    return children
  }
  navigate('/')
}

export default ProtectedRoute

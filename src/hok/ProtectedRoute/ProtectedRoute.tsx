import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ProtectedRouteProps } from './ProtectedRoute.props'

function ProtectedRoute(props: ProtectedRouteProps) {
  const { condition, children } = props

  const navigate = useNavigate()

  useEffect(() => {
    if (!condition) {
      navigate('/')
    }
  }, [condition])

  if (condition) {
    return children
  }
}

export default ProtectedRoute

import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function GuestRoute() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}

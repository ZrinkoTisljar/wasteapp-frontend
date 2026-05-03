import { Navigate } from 'react-router-dom'
import { getRole, isLoggedIn } from '../utils/auth'

// KOMPONENTA: ProtectedRoute
// SVRHA:
// - provjerava je li korisnik prijavljen
// - provjerava ima li traženu ulogu

function ProtectedRoute({ allowedRole, children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  const role = getRole()

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
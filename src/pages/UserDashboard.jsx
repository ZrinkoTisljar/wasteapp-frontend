import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, getAuth } from '../utils/auth'

// STRANICA: UserDashboard
// SVRHA:
// - početni ekran za korisnika
// - navigacija prema korisničkim funkcionalnostima

function UserDashboard() {
  const navigate = useNavigate()
  const auth = getAuth()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>User Dashboard</h1>
        <p>Prijavljen korisnik: {auth?.email}</p>
        <p>Uloga: {auth?.role}</p>

        <div className="menu">
          <Link className="menu-link" to="/user/create-work-order">
            Novi zahtjev za odvoz otpada
          </Link>

          <Link className="menu-link" to="/user/my-work-orders">
            Moji zahtjevi za odvoz otpada
          </Link>

          <Link className="menu-link" to="/user/my-manifests">
            Moji prateći listovi
          </Link>
        </div>

        <button onClick={handleLogout}>Odjava</button>
      </div>
    </div>
  )
}

export default UserDashboard
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { clearAuth, getAuth } from '../utils/auth'

// UVOZIMO FUNKCIJU ZA DOHVAT NALOGA (ovu već imaš!)
import { filterWorkOrders } from '../api/adminWorkOrders'

// API za korisnike koji čekaju odobrenje 
import { getPendingUsers } from '../api/adminUsers'

// STRANICA: AdminDashboard
// SVRHA: početni ekran za administratora sa sustavom obavijesti

function AdminDashboard() {
  const navigate = useNavigate()
  const auth = getAuth()

  // Stanja za brojače obavijesti
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [pendingUsersCount, setPendingUsersCount] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)

  // Ovdje se provjerava baza čim se Admin ulogira
  useEffect(() => {
    async function loadStats() {
      try {
        // 1. Prebrojavamo nove naloge (status CREATED)
        const newOrders = await filterWorkOrders({ status: 'CREATED' })
        setNewOrdersCount(newOrders.length)

      // 2. Prebrojavamo nove korisnike koji čekaju odobrenje
        const pendingUsers = await getPendingUsers()
        setPendingUsersCount(pendingUsers.length)

      } catch (error) {
        console.error("Greška kod dohvaćanja obavijesti:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
  }, [])

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Admin Dashboard</h1>
        <p>Prijavljen admin: <strong>{auth?.email}</strong></p>

        {/* --- OBAVIJESTI (WIDGETI) --- */}
        {!loadingStats && (
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '30px' }}>
            
            {/* Kartica za NOVE NALOGE */}
            {newOrdersCount > 0 ? (
              <div style={{ flex: 1, backgroundColor: '#fff3cd', borderLeft: '5px solid #ffc107', padding: '15px', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>🚨 Novi zahtjevi za odvoz</h3>
                <p style={{ margin: 0, color: '#856404' }}>
                  Imate <strong>{newOrdersCount}</strong>{" "}
                  {newOrdersCount === 1 ? "novi zahtjev koji čeka na dodjelu termina." 
                  : "novih zahtjeva koji čekaju na dodjelu termina."} 
                </p>
                <Link to="/admin/work-orders" style={{ display: 'inline-block', marginTop: '10px', color: '#856404', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Obradi odmah ➔
                </Link>
              </div>
            ) : (
              <div style={{ flex: 1, backgroundColor: '#d4edda', borderLeft: '5px solid #28a745', padding: '15px', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Ažurni ste!</h3>
                <p style={{ margin: 0, color: '#155724' }}>
                  Svi zahtjevi za odvoz otpada su obrađeni. Trenutno nema novih.
                </p>
              </div>
            )}

            {/* Kartica za KORISNIKE NA ČEKANJU (Prikazat će se samo ako ih je više od nula) */}
            {pendingUsersCount > 0 && (
              <div style={{ flex: 1, backgroundColor: '#f8d7da', borderLeft: '5px solid #dc3545', padding: '15px', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>👤 Novi korisnici</h3>
                <p style={{ margin: 0, color: '#721c24' }}>
                  <>
                  Imate <strong>{pendingUsersCount}</strong>{" "}
                   {pendingUsersCount === 1 ? " novog korisnika koji čeka odobrenje."
                    : "novih korisnika koji čekaju odobrenje."}
                  </>
                </p>
                <Link to="/admin/users" style={{ display: 'inline-block', marginTop: '10px', color: '#721c24', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Pregledaj korisnike ➔
                </Link>
              </div>
            )}

          </div>
        )}
        {/* --- KRAJ OBAVIJESTI --- */}

        <div className="menu" style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <Link className="menu-link" to="/admin/work-orders">
            Svi radni nalozi
          </Link>

          <Link className="menu-link" to="/admin/reports">
            Izvješća
          </Link>

          <Link className="menu-link" to="/admin/manifests">
            Prateći listovi
          </Link>
          
          <Link className="menu-link" to="/admin/users">
            Upravljanje korisnicima
          </Link>
        </div>

        <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#dc3545', color: 'white' }}>Odjava</button>
      </div>
    </div>
  )
}

export default AdminDashboard
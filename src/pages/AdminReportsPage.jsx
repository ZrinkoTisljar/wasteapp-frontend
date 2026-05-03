import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchWorkOrdersByStatus } from "../api/reports"
import { filterWorkOrders } from "../api/adminWorkOrders"
import { statusTranslations, translate } from '../utils/translations'

/**
 * STRANICA: AdminReportsPage
 *
 * SVRHA:
 * - prikazuje prilagođena izvješća sustava
 */
function AdminReportsPage() {
  const navigate = useNavigate()

  const [statusReport, setStatusReport] = useState([])
  const [userActivityReport, setUserActivityReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadReports() {
      try {
        // Dohvaćamo postojeće izvješće o statusima
        const statusData = await fetchWorkOrdersByStatus()
        setStatusReport(statusData)

        // Računamo novo izvješće: Aktivnost korisnika
        // Dohvatimo sve naloge i onda ih grupiramo po emailu
        const allOrders = await filterWorkOrders({})
        const activityMap = {}
        
        allOrders.forEach(order => {
            const email = order.userEmail || 'Nepoznat'
            if (!activityMap[email]) {
                activityMap[email] = 0
            }
            activityMap[email]++
        })

        // Pretvaramo mapu u niz za lakši prikaz u tablici
        const activityData = Object.keys(activityMap).map(email => ({
            email: email,
            count: activityMap[email]
        })).sort((a, b) => b.count - a.count) // Sortiramo od najvećeg prema najmanjem

        setUserActivityReport(activityData)

      } catch (err) {
        setError("Greška kod dohvaćanja izvješća.")
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Admin izvješća</h1>

        <button onClick={() => navigate("/admin")} style={{ marginBottom: "20px" }}>
          Natrag
        </button>

        {loading && <p>Učitavanje izvješća...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            {/* TABLICA 1: Statusi */}
            <div style={{ flex: '1 1 45%' }}>
                <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                    📊 Broj naloga po statusu
                </h2>
                <table className="data-table">
                <thead>
                    <tr>
                    <th>Status naloga</th>
                    <th>Ukupan broj</th>
                    </tr>
                </thead>
                <tbody>
                    {statusReport.length > 0 ? (
                        statusReport.map(r => (
                        <tr key={r.status}>
                            <td>
                                <strong>{translate(statusTranslations, r.status)}</strong>
                            </td>
                            <td style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{r.totalCount}</td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">Nema podataka</td></tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* TABLICA 2: Aktivnost korisnika */}
            <div style={{ flex: '1 1 45%' }}>
                <h2 style={{ borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
                    🏆 Najaktivniji korisnici
                </h2>
                <table className="data-table">
                <thead>
                    <tr>
                    <th>Email korisnika</th>
                    <th>Broj poslanih zahtjeva</th>
                    </tr>
                </thead>
                <tbody>
                    {userActivityReport.length > 0 ? (
                        userActivityReport.map(r => (
                        <tr key={r.email}>
                            <td>{r.email}</td>
                            <td style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{r.count}</td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">Nema podataka</td></tr>
                    )}
                </tbody>
                </table>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReportsPage
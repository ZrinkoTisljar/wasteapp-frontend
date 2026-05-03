import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyWorkOrders } from '../api/workOrders'

// STRANICA: MyWorkOrdersPage
// SVRHA:
// - prikazuje sve naloge prijavljenog korisnika

function MyWorkOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchMyWorkOrders()
        setOrders(data)
      } catch (err) {
        setError('Ne mogu učitati tvoje radne naloge.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Pomoćna funkcija za lijepo ispisivanje datuma i vremena
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Formatira u npr: "15.05.2026. u 14:30"
    return date.toLocaleString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' u');
  };

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Moji zahtjevi za odvoz otpada</h1>

        <button onClick={() => navigate('/user')} style={{ marginBottom: "15px" }}>Natrag</button>

        {loading && <p>Učitavanje...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && orders.length === 0 && <p>Nemaš još radnih naloga.</p>}

        {!loading && !error && orders.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vrsta otpada</th>
                {/* Promijenjeno iz Lokacija u Adresa preuzimanja */}
                <th>Adresa preuzimanja</th>
                <th>Količina</th>
                <th>Status / Termin odvoza</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.wasteTypeName}</td>
                  
                  {/* Prikazujemo adresu koju je građanin upisao */}
                  <td>{order.pickupAddress || 'Nije upisano'}</td>
                  
                  {/* Spojili smo količinu i jedinicu u jedan stupac radi boljeg izgleda */}
                  <td>{order.quantity} {order.unit}</td>
                  
                  {/* MAGIJA ZA DATUM ODVOZA */}
                  <td>
                    {/* Prikažemo trenutni status */}
                    <span style={{ fontWeight: "bold" }}>
                      {order.status === 'CREATED' && 'Na čekanju'}
                      {order.status === 'SCHEDULED' && 'Planiran odvoz'}
                      {order.status === 'COMPLETED' && 'Završen'}
                      {order.status === 'CANCELLED' && 'Otkazan'}
                    </span>
                    
                    {/* Ako je status SCHEDULED i ako imamo datum, ispišemo ga zelenim slovima */}
                    {order.status === 'SCHEDULED' && order.scheduledFor && (
                      <div style={{ marginTop: '8px', color: '#28a745', fontWeight: 'bold' }}>
                        🚛 Kamion dolazi:<br/>
                        {formatDateTime(order.scheduledFor)}
                      </div>
                    )}
                    
                    {/* (Opcija) Ako je završen, možemo pokazati i kad je završen */}
                    {order.status === 'COMPLETED' && order.completedAt && (
                      <div style={{ marginTop: '8px', color: '#6c757d', fontSize: '0.9em' }}>
                        Odrađeno: {formatDateTime(order.completedAt)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MyWorkOrdersPage
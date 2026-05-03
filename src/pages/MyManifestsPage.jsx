import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchMyManifests, downloadManifestPdf } from "../api/manifests"

/**
 * STRANICA: MyManifestsPage
 *
 * SVRHA:
 * - prikaz manifesta prijavljenog korisnika
 * - omogućava preuzimanje PDF pratećeg lista
 */

function MyManifestsPage() {

  const navigate = useNavigate()

  const [manifests, setManifests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    async function load() {

      try {

        const data = await fetchMyManifests()
        setManifests(data)

      } catch (err) {

        setError("Ne mogu učitati manifeste.")

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [])

  return (

    <div className="page">

      <div className="card wide-card">

        <h1>Moji manifesti</h1>

        <button onClick={() => navigate("/user")}>
          Natrag
        </button>

        {loading && <p>Učitavanje...</p>}

        {error && <div className="error">{error}</div>}

        {!loading && manifests.length === 0 && (
          <p>Nemaš još generiranih manifesta.</p>
        )}

        {!loading && manifests.length > 0 && (

          <table className="data-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>WorkOrder</th>
                <th>Waste</th>
                <th>Količina</th>
                <th>PDF</th>
              </tr>
            </thead>

            <tbody>

              {manifests.map(m => (

                <tr key={m.id}>

                  <td>{m.id}</td>

                  <td>{m.workOrderId}</td>

                  <td>{m.wasteTypeName}</td>

                  <td>{m.quantity} {m.unit}</td>

                 <td>
                    {/* ZAMJENA: Umjesto <a> taga  <button> s onClick događajem */}
                    <button 
                      onClick={() => downloadManifestPdf(m.id)}
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                    >
                      Preuzmi PDF
                    </button>
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

export default MyManifestsPage
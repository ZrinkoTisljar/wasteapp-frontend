import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAllManifests } from "../api/adminManifests"
import { downloadManifestPdf } from "../api/manifests"

/**
 * STRANICA: AdminManifestsPage
 *
 * SVRHA:
 * - admin vidi sve manifeste (PRATEĆE LISTE) u sustavu
 * - omogućava preuzimanje PDF pratećeg lista
 */

function AdminManifestsPage() {

  const navigate = useNavigate()

  const [manifests, setManifests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    async function load() {

      try {

        const data = await fetchAllManifests()
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

        <h1>Svi prateći listovi</h1>

        <button onClick={() => navigate("/admin")}>
          Natrag
        </button>

        {loading && <p>Učitavanje...</p>}
        {error && <div className="error">{error}</div>}

        {!loading && manifests.length > 0 && (

          <table className="data-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Radni nalog</th>
                <th>Korisnik</th>
                <th>OTPAD</th>
                <th>Količina</th>
                <th>PDF</th>
              </tr>
            </thead>

            <tbody>

              {manifests.map(m => (

                <tr key={m.id}>

                  <td>{m.id}</td>
                  <td>{m.workOrderId}</td>
                  <td>{m.userEmail}</td>
                  <td>{m.wasteTypeName}</td>
                  <td>{m.quantity} {m.unit}</td>

                  <td>

                    <button
                      onClick={() => downloadManifestPdf(m.id)}
                    >
                      PDF
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

export default AdminManifestsPage
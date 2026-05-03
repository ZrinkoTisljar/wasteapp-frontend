import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  completeWorkOrder,
  fetchAllWorkOrders,
  scheduleWorkOrder,
  filterWorkOrders,
} from "../api/adminWorkOrders"
import { createManifestForWorkOrder } from "../api/adminManifests"

import { statusTranslations, unitTranslations, translate } from '../utils/translations';

function AdminWorkOrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  // Filteri
  const [statusFilter, setStatusFilter] = useState("")
  const [wasteTypeCodeFilter, setWasteTypeCodeFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [userEmailFilter, setUserEmailFilter] = useState("")

  // NOVO: Stanje koje pamti odabrane datume za svaki pojedini nalog
  const [scheduleDates, setScheduleDates] = useState({})

  async function load() {
    setError("")
    setInfo("")
    setLoading(true)
    try {
      const data = await fetchAllWorkOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message || "Greška kod dohvaćanja naloga.")
    } finally {
      setLoading(false)
    }
  }

  async function handleFilter() {
    setError("")
    setInfo("")
    setLoading(true)
    try {
      const data = await filterWorkOrders({
        status: statusFilter,
        wasteTypeCode: wasteTypeCodeFilter,
        city: cityFilter,
        userEmail: userEmailFilter,
      })
      setOrders(data)
    } catch (err) {
      setError(err.message || "Filtriranje nije uspjelo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResetFilters() {
    setStatusFilter("")
    setWasteTypeCodeFilter("")
    setCityFilter("")
    setUserEmailFilter("")
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  // NOVO: Ažurirana metoda za zakazivanje
 async function handleSchedule(id) {
    const selectedDate = scheduleDates[id];
    
    // zastita: Ako datum nije odabran, prekini funkciju i javi grešku!
    if (!selectedDate || selectedDate === "undefined") {
      alert("⚠️ Molimo odaberite datum i vrijeme u kalendaru prije nego što zakažete odvoz!");
      return; 
    }

    setError("")
    setInfo("")
    setBusyId(id)

    try {
      await scheduleWorkOrder(id, selectedDate)
      setInfo(`Nalog ${id} je planiran za ${selectedDate}.`)
      await load()
    } catch (err) {
      setError(err.message || "Zakazivanje nije uspjelo.")
    } finally {
      setBusyId(null)
    }
  }

  // NOVO: Ažurirana metoda za završetak s potvrdom
  async function handleComplete(id) {
    // Upit za sigurnost
    const isConfirmed = window.confirm("Jeste li sigurni da je otpad uspješno pokupljen i da želite završiti ovaj nalog?");
    if (!isConfirmed) return; // Ako klikne Odustani, prekidamo akciju

    setError("")
    setInfo("")
    setBusyId(id)

    try {
      await completeWorkOrder(id)
      setInfo(`Nalog ${id} je uspješno završen.`)
      await load()
    } catch (err) {
      setError(err.message || "Complete nije uspio.")
    } finally {
      setBusyId(null)
    }
  }

// NOVO: Stanje koje pamti koji su manifesti već generirani (po ID-u naloga)
  const [generatedManifests, setGeneratedManifests] = useState([]);

  async function handleGenerateManifest(order) {
    setError("")
    setInfo("")
    setBusyId(order.id)
    try {
      const manifest = await createManifestForWorkOrder(
        order.id,
        order.note || "Redovni odvoz otpada temeljem zahtjeva."
      )
      setInfo(`Prateći list uspješno kreiran: ${manifest.manifestNumber}`)
      
      // Dodajemo ID ovog naloga u našu listu uspješno generiranih
      setGeneratedManifests(prev => [...prev, order.id]);

    } catch (err) {
      // Ako backend vrati Grešku 500, to znači da je list najvjerojatnije već generiran!
      setError(" Prateći list je već generiran za ovaj nalog. Potražite ga u izborniku 'Prateći listovi'.");
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Svi radni nalozi</h1>
        
        <div className="button-row">
          <button onClick={() => navigate("/admin")}>Natrag</button>
          <button onClick={load} disabled={loading}>
            Osvježi
          </button>
        </div>

        {/* --- Filter forma (OSTALA ISTA) --- */}
        <div className="filter-section" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          <h2>Filtriranje naloga</h2>
          <div className="filter-grid">
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '5px' }}>
                <option value="">-- svi statusi --</option>
                <option value="CREATED">Kreiran</option>
                <option value="SCHEDULED">Planiran odvoz</option>
                <option value="COMPLETED">Završen</option>
                <option value="CANCELLED">Otkazan</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Waste Type Code</label>
              <input type="text" value={wasteTypeCodeFilter} onChange={(e) => setWasteTypeCodeFilter(e.target.value)} placeholder="npr. PLASTIC" style={{ padding: '5px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Grad</label>
              <input type="text" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} placeholder="npr. Cakovec" style={{ padding: '5px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>User Email</label>
              <input type="text" value={userEmailFilter} onChange={(e) => setUserEmailFilter(e.target.value)} placeholder="npr. user@test.com" style={{ padding: '5px' }} />
            </div>
          </div>
          <div className="button-row">
            <button onClick={handleFilter}>Filtriraj</button>
            <button onClick={handleResetFilters}>Resetiraj</button>
          </div>
        </div>
        {/* --- KRAJ BLOKA ZA FILTRE --- */}

        {loading && <p>Učitavanje...</p>}
        {error && <div className="error">{error}</div>}
        {info && <div className="success">{info}</div>}

        {!loading && orders.length === 0 && <p>Nema naloga.</p>}

        {!loading && orders.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Korisnik</th>
                <th>Vrsta otpada</th>
                {/* DODALI SMO ADRESU OVDJE */}
                <th>Adresa preuzimanja</th>
                <th>Količina</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const isBusy = busyId === o.id

                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <strong>{o.userName}</strong> <br />
                      <span style={{ fontSize: "0.85em", color: "#555" }}>
                        {o.userEmail}
                      </span>
                    </td>
                    <td>{o.wasteTypeName}</td>
                    
                    {/* PRIKAZ ADRESE */}
                    <td>
                      <strong>{o.pickupAddress || 'Nema adrese'}</strong>
                    </td>
                    
                    <td>
                      {o.quantity} {translate(unitTranslations, o.unit)}
                    </td>
                    <td>{translate(statusTranslations, o.status)}</td>
                    
                    <td>
                      <div className="button-row" style={{ alignItems: 'center', gap: '10px' }}>
                        
                        {/* KALENDAR I GUMB ZA KREIRANJE NALOGA (Prikazuje se samo ako je nalog tek kreiran) */}
                        {o.status === 'CREATED' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <input 
                              type="datetime-local" 
                              value={scheduleDates[o.id] || ""} 
                              onChange={(e) => setScheduleDates({...scheduleDates, [o.id]: e.target.value})}
                              style={{ padding: '4px', fontSize: '12px' }}
                            />
                            <button
                              onClick={() => handleSchedule(o.id)}
                              disabled={isBusy}
                              style={{ backgroundColor: "#ffc107", color: "black" }} // Žuti gumb da se ističe
                            >
                              Zakaži odvoz
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleComplete(o.id)}
                          //Gumb je onemogućen ako
                          disabled={isBusy || o.status === 'COMPLETED' || o.status === 'CREATED'} // Ne može se završiti ako je već završen ili ako je tek kreiran (mora se prvo zakazati)
                        >
                          Završi nalog
                        </button>

                        <button
                          onClick={() => handleGenerateManifest(o)}
                          disabled={isBusy || o.status === 'CREATED'}
                        >
                          Generiraj prateći list
                        </button>

                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminWorkOrdersPage
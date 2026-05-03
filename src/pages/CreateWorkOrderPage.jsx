import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWasteTypes } from '../api/reference'
import { createWorkOrder } from '../api/workOrders'

// STRANICA: CreateWorkOrderPage (novi zahtjev za odvoz otpada)
//
// SVRHA:
// - korisnik bira vrstu otpada, količinu, jedinicu i napomenu
// - NOVO: Korisnik upisuje ADRESU PREUZIMANJA (gdje se otpad nalazi)
// - Lokaciju (reciklažno dvorište / odredište) i dalje određuje Admin!

function CreateWorkOrderPage() {
  const navigate = useNavigate()

  const [wasteTypes, setWasteTypes] = useState([])
  
  // Stanja za formu
  const [wasteTypeId, setWasteTypeId] = useState('')
  // NOVO STANJE: Adresa preuzimanja
  const [pickupAddress, setPickupAddress] = useState('') 
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('KG')
  const [note, setNote] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const wasteTypesData = await fetchWasteTypes()
        setWasteTypes(wasteTypesData)
      } catch (err) {
        setError('Ne mogu učitati vrste otpada.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      // Šalju se podaci na backend (mora se podudarati s WorkOrderCreateRequest.java)
      await createWorkOrder({
        wasteTypeId: Number(wasteTypeId),
        collectionPointId: null, // Odredište ostaje prazno za Admina
        pickupAddress: pickupAddress, // NOVO: Šaljemo adresu koju je korisnik upisao
        quantity: Number(quantity),
        unit,
        note,
      })

      setSuccess('Zahtjev je uspješno poslan. Administrator će organizirati odvoz.')
      
      // Resetiramo formu nakon uspješnog slanja
      setWasteTypeId('')
      setPickupAddress('') // Čistimo i ovo polje
      setQuantity('')
      setUnit('KG')
      setNote('')
    } catch (err) {
      setError(err.message || 'Greška kod slanja zahtjeva.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">Učitavanje...</div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Novi zahtjev za odvoz otpada</h1>

        <form onSubmit={handleSubmit} className="form">
          
          <label>Vrsta otpada</label>
          <select value={wasteTypeId} onChange={(e) => setWasteTypeId(e.target.value)} required>
            <option value="">-- odaberi vrstu otpada --</option>
            {wasteTypes.map((wt) => (
              <option key={wt.id} value={wt.id}>
                {wt.name} ({wt.code})
              </option>
            ))}
          </select>

          {/* NOVO POLJE: Adresa preuzimanja */}
          <label>Adresa preuzimanja (Gdje se otpad nalazi?)</label>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="npr. Ispred garaže, Ilica 10, Zagreb"
            required
          />

          <label>Količina</label>
          <input
            type="number"
            step="0.001"
            min="0.001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label>Jedinica</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="KG">KG</option>
            <option value="T">T</option>
            <option value="M3">M3</option>
          </select>

          <label>Napomena</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            placeholder="upiši dodatnu napomenu"
          />

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="button-row">
            <button type="button" onClick={() => navigate('/user')} style={{ backgroundColor: "#6c757d", color: "white" }}>
              Natrag
            </button>

            <button type="submit" disabled={submitting} style={{ backgroundColor: "#007bff", color: "white" }}>
              {submitting ? 'Slanje...' : 'Pošalji zahtjev'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateWorkOrderPage
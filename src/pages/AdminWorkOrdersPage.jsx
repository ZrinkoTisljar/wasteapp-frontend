import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  completeWorkOrder,
  fetchAllWorkOrders,
  scheduleWorkOrder,
  filterWorkOrders,
} from "../api/adminWorkOrders"

import { createManifestForWorkOrder } from "../api/adminManifests"

import {
  statusTranslations,
  unitTranslations,
  translate,
} from "../utils/translations"

function AdminWorkOrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  // Vrijednosti filtera
  const [statusFilter, setStatusFilter] = useState("")
  const [wasteTypeCodeFilter, setWasteTypeCodeFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [userEmailFilter, setUserEmailFilter] = useState("")

  // Pamti odabrani datum i vrijeme za svaki radni nalog
  const [scheduleDates, setScheduleDates] = useState({})

  // Pamti radne naloge za koje je generiran prateći list
  const [generatedManifests, setGeneratedManifests] = useState([])

  /**
   * Dohvaća sve radne naloge s backenda.
   */
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

  /**
   * Filtrira radne naloge prema odabranim vrijednostima.
   */
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

  /**
   * Briše unesene filtere i ponovno učitava sve naloge.
   */
  async function handleResetFilters() {
    setStatusFilter("")
    setWasteTypeCodeFilter("")
    setCityFilter("")
    setUserEmailFilter("")

    await load()
  }

  /**
   * Vraća trenutačni lokalni datum i vrijeme u formatu
   * koji koristi HTML datetime-local polje.
   */
  function getCurrentLocalDateTime() {
    const now = new Date()
    const timezoneOffset = now.getTimezoneOffset() * 60000

    return new Date(now.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, 16)
  }

  /**
   * Zakazuje odvoz za odabrani radni nalog.
   */
  async function handleSchedule(id) {
    const selectedDate = scheduleDates[id]

    // Datum i vrijeme moraju biti odabrani
    if (!selectedDate) {
      alert("Molimo odaberite datum i vrijeme odvoza.")
      return
    }

    const selectedDateTime = new Date(selectedDate)
    const currentDateTime = new Date()

    // Zakazivanje odvoza u prošlosti nije dopušteno
    if (selectedDateTime < currentDateTime) {
      alert("Datum i vrijeme odvoza ne mogu biti u prošlosti.")
      return
    }

    setError("")
    setInfo("")
    setBusyId(id)

    try {
      await scheduleWorkOrder(id, selectedDate)

      setInfo(`Nalog ${id} je planiran za ${selectedDate}.`)

      // Uklanja spremljeni datum za nalog nakon uspješnog zakazivanja
      setScheduleDates((previousDates) => {
        const updatedDates = { ...previousDates }
        delete updatedDates[id]
        return updatedDates
      })

      await load()
    } catch (err) {
      setError(err.message || "Zakazivanje nije uspjelo.")
    } finally {
      setBusyId(null)
    }
  }

  /**
   * Označava radni nalog kao završen nakon potvrde administratora.
   */
  async function handleComplete(id) {
    const isConfirmed = window.confirm(
      "Jeste li sigurni da je otpad uspješno pokupljen i da želite završiti ovaj nalog?"
    )

    if (!isConfirmed) {
      return
    }

    setError("")
    setInfo("")
    setBusyId(id)

    try {
      await completeWorkOrder(id)
      setInfo(`Nalog ${id} je uspješno završen.`)
      await load()
    } catch (err) {
      setError(err.message || "Završavanje naloga nije uspjelo.")
    } finally {
      setBusyId(null)
    }
  }

  /**
   * Generira prateći list za odabrani radni nalog.
   */
  async function handleGenerateManifest(order) {
    setError("")
    setInfo("")
    setBusyId(order.id)

    try {
      const manifest = await createManifestForWorkOrder(
        order.id,
        order.note || "Redovni odvoz otpada temeljem zahtjeva."
      )

      setInfo(
        `Prateći list uspješno kreiran: ${manifest.manifestNumber}`
      )

      // Sprema ID naloga za koji je generiran prateći list
      setGeneratedManifests((previousIds) => {
        if (previousIds.includes(order.id)) {
          return previousIds
        }

        return [...previousIds, order.id]
      })
    } catch (err) {
      setError(
        err.message ||
          "Prateći list nije moguće generirati. Moguće je da već postoji za ovaj nalog."
      )
    } finally {
      setBusyId(null)
    }
  }

  /**
   * Učitava radne naloge pri prvom prikazu stranice.
   */
  useEffect(() => {
    load()
  }, [])

  return (
    <div className="page">
      <div className="card wide-card">
        <h1>Svi radni nalozi</h1>

        <div className="button-row">
          <button onClick={() => navigate("/admin")}>
            Natrag
          </button>

          <button onClick={load} disabled={loading}>
            Osvježi
          </button>
        </div>

        {/* Filteri radnih naloga */}
        <div
          className="filter-section"
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h2>Filtriranje naloga</h2>

          <div className="filter-grid">
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                style={{ padding: "5px" }}
              >
                <option value="">-- svi statusi --</option>
                <option value="CREATED">Kreiran</option>
                <option value="SCHEDULED">
                  Planiran odvoz
                </option>
                <option value="COMPLETED">Završen</option>
                <option value="CANCELLED">Otkazan</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Šifra vrste otpada
              </label>

              <input
                type="text"
                value={wasteTypeCodeFilter}
                onChange={(event) =>
                  setWasteTypeCodeFilter(event.target.value)
                }
                placeholder="npr. PLASTIC"
                style={{ padding: "5px" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Grad
              </label>

              <input
                type="text"
                value={cityFilter}
                onChange={(event) =>
                  setCityFilter(event.target.value)
                }
                placeholder="npr. Čakovec"
                style={{ padding: "5px" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Email korisnika
              </label>

              <input
                type="text"
                value={userEmailFilter}
                onChange={(event) =>
                  setUserEmailFilter(event.target.value)
                }
                placeholder="npr. user@test.com"
                style={{ padding: "5px" }}
              />
            </div>
          </div>

          <div className="button-row">
            <button onClick={handleFilter}>
              Filtriraj
            </button>

            <button onClick={handleResetFilters}>
              Resetiraj
            </button>
          </div>
        </div>

        {loading && <p>Učitavanje...</p>}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {info && (
          <div className="success">
            {info}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <p>Nema naloga.</p>
        )}

        {!loading && orders.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Korisnik</th>
                <th>Vrsta otpada</th>
                <th>Adresa preuzimanja</th>
                <th>Količina</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const isBusy = busyId === order.id

                const manifestGenerated =
                  generatedManifests.includes(order.id)

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>
                      <strong>{order.userName}</strong>
                      <br />

                      <span
                        style={{
                          fontSize: "0.85em",
                          color: "#555",
                        }}
                      >
                        {order.userEmail}
                      </span>
                    </td>

                    <td>{order.wasteTypeName}</td>

                    <td>
                      <strong>
                        {order.pickupAddress || "Nema adrese"}
                      </strong>
                    </td>

                    <td>
                      {order.quantity}{" "}
                      {translate(
                        unitTranslations,
                        order.unit
                      )}
                    </td>

                    <td>
                      {translate(
                        statusTranslations,
                        order.status
                      )}
                    </td>

                    <td>
                      <div
                        className="button-row"
                        style={{
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Zakazivanje je dostupno samo za kreirani nalog */}
                        {order.status === "CREATED" && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="datetime-local"
                              value={
                                scheduleDates[order.id] || ""
                              }
                              min={getCurrentLocalDateTime()}
                              onChange={(event) =>
                                setScheduleDates(
                                  (previousDates) => ({
                                    ...previousDates,
                                    [order.id]:
                                      event.target.value,
                                  })
                                )
                              }
                              style={{
                                padding: "4px",
                                fontSize: "12px",
                              }}
                            />

                            <button
                              onClick={() =>
                                handleSchedule(order.id)
                              }
                              disabled={isBusy}
                              style={{
                                backgroundColor: "#ffc107",
                                color: "black",
                              }}
                            >
                              Zakaži odvoz
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() =>
                            handleComplete(order.id)
                          }
                          disabled={
                            isBusy ||
                            order.status === "COMPLETED" ||
                            order.status === "CREATED"
                          }
                        >
                          Završi nalog
                        </button>

                        <button
                          onClick={() =>
                            handleGenerateManifest(order)
                          }
                          disabled={
                            isBusy ||
                            order.status === "CREATED" ||
                            manifestGenerated
                          }
                        >
                          {manifestGenerated
                            ? "Prateći list generiran"
                            : "Generiraj prateći list"}
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
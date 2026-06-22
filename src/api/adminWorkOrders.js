import { authFetch } from "./http"

/**
 * API: admin work orders
 * SVRHA:
 * - svi admin pozivi prema work orders endpointima
 * - koristi lokalni backend u razvoju
 * - koristi cloud backend ako je postavljen VITE_API_BASE_URL
 */

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - dohvaća backend URL iz .env datoteke
// - ako .env ne postoji, koristi lokalni backend na localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - osnovna putanja za administratorske radne naloge
const ADMIN_WORK_ORDERS_URL = `${API_BASE_URL}/api/admin/work-orders`

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - dohvaća sve radne naloge za administratora
 */
export async function fetchAllWorkOrders() {
  const res = await authFetch(ADMIN_WORK_ORDERS_URL)

  if (!res.ok) {
    throw new Error("Dohvat svih naloga nije uspio.")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - administrator planira datum odvoza za određeni radni nalog
 *
 * PARAMETRI:
 * - id: ID radnog naloga
 * - dateStr: datum planiranog odvoza
 */
export async function scheduleWorkOrder(id, dateStr) {
  const params = new URLSearchParams()
  params.append("date", dateStr)

  const res = await authFetch(`${ADMIN_WORK_ORDERS_URL}/${id}/schedule?${params.toString()}`, {
    method: "PATCH",
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || "Greška kod planiranja")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - administrator označava radni nalog kao završen
 */
export async function completeWorkOrder(id) {
  const res = await authFetch(`${ADMIN_WORK_ORDERS_URL}/${id}/complete`, {
    method: "PATCH",
  })

  if (!res.ok) {
    throw new Error("Označavanje kao COMPLETED nije uspjelo.")
  }

  return res.json()
}

/**
 * PROGRAMSKI ENTITET: async funkcija
 * SVRHA:
 * - filtrira radne naloge prema zadanim kriterijima
 *
 * PARAMETRI:
 * - status
 * - wasteTypeCode
 * - city
 * - userEmail
 *
 * Ako je parametar prazan, ne šalje se u query string.
 */
export async function filterWorkOrders(filters) {
  const params = new URLSearchParams()

  if (filters.status) {
    params.append("status", filters.status)
  }

  if (filters.wasteTypeCode) {
    params.append("wasteTypeCode", filters.wasteTypeCode)
  }

  if (filters.city) {
    params.append("city", filters.city)
  }

  if (filters.userEmail) {
    params.append("userEmail", filters.userEmail)
  }

  const url = `${ADMIN_WORK_ORDERS_URL}/filter?${params.toString()}`

  const res = await authFetch(url)

  if (!res.ok) {
    throw new Error("Filtriranje naloga nije uspjelo.")
  }

  return res.json()
}
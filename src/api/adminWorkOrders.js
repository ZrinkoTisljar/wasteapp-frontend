import { authFetch } from "./http"

/**
 * API: admin work orders
 * SVRHA:
 * - svi admin pozivi prema work orders endpointima
 */

export async function fetchAllWorkOrders() {
  const res = await authFetch("http://localhost:8080/api/admin/work-orders")

  if (!res.ok) {
    throw new Error("Dohvat svih naloga nije uspio.")
  }

  return res.json()
}

/**
 * prvi schedule work order
 
export async function scheduleWorkOrder(id) {
  const res = await authFetch(
    `http://localhost:8080/api/admin/work-orders/${id}/schedule`,
    { method: "PATCH" }
  )

  if (!res.ok) {
    throw new Error("Planiranje odvoza nije uspjelo.")
  }

  return res.json()
}
**************************************************/

// Novi parametar dateStr i dodan u URL
export async function scheduleWorkOrder(id, dateStr) {
  // Dodali smo puni URL s http://localhost:8080 kako se ne bi izgubio!
  const res = await authFetch(`http://localhost:8080/api/admin/work-orders/${id}/schedule?date=${dateStr}`, {
    method: 'PATCH',
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Greška kod planiranja');
  }
  return res.json();
}

/**
 * ADMIN akcija: complete work order
 */
export async function completeWorkOrder(id) {
  const res = await authFetch(
    `http://localhost:8080/api/admin/work-orders/${id}/complete`,
    { method: "PATCH" }
  )

  if (!res.ok) {
    throw new Error("Označavanje kao COMPLETED nije uspjelo.")
  }

  return res.json()
}

/**
 * ADMIN filtriranje radnih naloga
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

  const url = `http://localhost:8080/api/admin/work-orders/filter?${params.toString()}`

  const res = await authFetch(url)

  if (!res.ok) {
    throw new Error("Filtriranje naloga nije uspjelo.")
  }

  return res.json()
}
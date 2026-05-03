import { authFetch } from "./http"

/**
 * API POZIVI ZA IZVJEŠĆA
 */

export async function fetchWasteByType() {

  const res = await authFetch(
    "http://localhost:8080/api/admin/reports/waste-by-type"
  )

  if (!res.ok) {
    throw new Error("Izvješće po vrsti otpada nije dostupno.")
  }

  return res.json()
}

export async function fetchWorkOrdersByStatus() {

  const res = await authFetch(
    "http://localhost:8080/api/admin/reports/work-orders-by-status"
  )

  if (!res.ok) {
    throw new Error("Izvješće po statusu nije dostupno.")
  }

  return res.json()
}

export async function fetchWasteByCity() {

  const res = await authFetch(
    "http://localhost:8080/api/admin/reports/waste-by-city"
  )

  if (!res.ok) {
    throw new Error("Izvješće po gradu nije dostupno.")
  }

  return res.json()
}
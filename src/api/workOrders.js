import { authFetch } from './http'

// API POZIVI ZA WORK ORDER

export async function fetchMyWorkOrders() {
  const response = await authFetch('http://localhost:8080/api/work-orders/mine')

  if (!response.ok) {
    throw new Error('Dohvat mojih naloga nije uspio.')
  }

  return response.json()
}

export async function createWorkOrder(payload) {
  const response = await authFetch('http://localhost:8080/api/work-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Kreiranje radnog naloga nije uspjelo.')
  }

  return response.json()
}
import { authFetch } from './http'

// API POZIVI ZA WORK ORDER
// SVRHA:
// - dohvat radnih naloga prijavljenog korisnika
// - kreiranje novog radnog naloga
// - koristi lokalni backend u razvoju
// - koristi cloud backend ako je postavljen VITE_API_BASE_URL

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - dohvaća backend URL iz .env datoteke ako postoji
// - ako .env ne postoji, koristi lokalni backend na localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - osnovna putanja za work order endpointove
const WORK_ORDERS_URL = `${API_BASE_URL}/api/work-orders`

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - dohvaća radne naloge prijavljenog korisnika
export async function fetchMyWorkOrders() {
  const response = await authFetch(`${WORK_ORDERS_URL}/mine`)

  if (!response.ok) {
    throw new Error('Dohvat mojih naloga nije uspio.')
  }

  return response.json()
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - kreira novi radni nalog
export async function createWorkOrder(payload) {
  const response = await authFetch(`${WORK_ORDERS_URL}`, {
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
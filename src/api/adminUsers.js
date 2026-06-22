// src/api/adminUsers.js
// API POZIVI ZA ADMINISTRACIJU KORISNIKA
// SVRHA:
// - dohvati sve korisnike
// - dohvati korisnike koji čekaju odobrenje
// - odobri korisnika
// - obriši korisnika

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - koristi backend URL iz .env datoteke ako postoji
// - ako .env ne postoji, koristi lokalni backend na localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// PROGRAMSKI ENTITET: konstanta
// SVRHA:
// - osnovna putanja za administratorske korisničke endpointove
const API_URL = `${API_BASE_URL}/api/admin/users`

// PROGRAMSKI ENTITET: pomoćna funkcija
// SVRHA:
// - dohvaća JWT token iz localStorage-a
// - vraća zaglavlja potrebna za zaštićene API pozive
const getAuthHeaders = () => {
  // 1. Dohvaća string iz localStorage-a pod točnim ključem
  const authDataString = localStorage.getItem('wasteapp_auth')
  let token = ''

  // 2. Ako podaci postoje, parsira JSON i izvlači samo token
  if (authDataString) {
    const authData = JSON.parse(authDataString)
    token = authData.token
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - dohvaća sve korisnike iz sustava
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/listAllUsers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Greška pri dohvatu svih korisnika')
  }

  return response.json()
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - dohvaća korisnike koji čekaju administratorsko odobrenje
export const getPendingUsers = async () => {
  const response = await fetch(`${API_URL}/pending`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Greška pri dohvatu korisnika na čekanju')
  }

  return response.json()
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - odobrava korisnika prema njegovom ID-u
export const approveUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Greška pri odobravanju korisnika')
  }

  return response.text()
}

// PROGRAMSKI ENTITET: async funkcija
// SVRHA:
// - briše korisnika prema njegovom ID-u
export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Greška pri brisanju korisnika')
  }

  return response.text()
}
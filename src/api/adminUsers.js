// src/api/adminUsers.js
// API POZIVI ZA ADMINISTRACIJU KORISNIKA
// SVRHA:
// - dohvati sve korisnike (odobrene i neodobrene)
// - dohvati samo korisnike koji čekaju odobrenje (ostavljeno za svaki slučaj)
// - odobri korisnika
// - odbaci (obriši) korisnika
const API_URL = 'http://localhost:8080/api/admin/users';

// Pomoćna funkcija za dohvat tokena
const getAuthHeaders = () => {
    // 1. Dohvaća string iz localStorage-a pod točnim ključem
    const authDataString = localStorage.getItem('wasteapp_auth');
    let token = '';

    // 2. Ako podaci postoje, parsira JSON i izvlačimo samo token
    if (authDataString) {
        const authData = JSON.parse(authDataString);
        token = authData.token;
    }
    
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};


// NOVA FUNKCIJA: Dohvaća apsolutno sve korisnike
export const getAllUsers = async () => {
    // PAZI: Ovdje smo promijenili link da točno gađa tvoj UserController u Spring Bootu!
    const response = await fetch(`http://localhost:8080/api/users/listAllUsers`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Greška pri dohvatu svih korisnika');
    return response.json();
};

export const getPendingUsers = async () => {
    const response = await fetch(`${API_URL}/pending`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Greška pri dohvatu korisnika na čekanju');
    return response.json();
};

export const approveUser = async (id) => {
    const response = await fetch(`${API_URL}/${id}/approve`, {
        method: 'PATCH', // ili PUT, ovisno kako ti je na backendu
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Greška pri odobravanju korisnika');
    return response.text();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Greška pri brisanju korisnika');
    return response.text();
};
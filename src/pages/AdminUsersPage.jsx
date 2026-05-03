// src/pages/AdminUsersPage.jsx
// SVRHA:
// - admin vidi SVE korisnike (na čekanju i odobrene) u dvije odvojene tablice
// - admin može odobriti ili obrisati korisnika
// - prikazani su svi podaci (OIB, telefon, adresa...) osim lozinke
import React, { useEffect, useState } from 'react';
// PAZI: Ovdje se promijenilo iz getPendingUsers u getAllUsers
import { getAllUsers, approveUser, deleteUser } from '../api/adminUsers';
import { useNavigate } from "react-router-dom";
import { userTypeTranslations, translate } from '../utils/translations';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // Učitaj korisnike čim se stranica otvori
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers(); // Sada dohvaćamo apsolutno sve
            setUsers(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveUser(id);
            setMessage('Korisnik uspješno odobren!');
            // Ne briše se iz statea, nego se samo mijenjamo status u "odobren"
            // Tako će automatski "uskočiti" u donju tablicu!
            setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
            
            // Očisti poruku nakon 5 sekunde
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) return;
        
        try {
            await deleteUser(id);
            setMessage('Korisnik uspješno obrisan!');
            setUsers(users.filter(u => u.id !== id));
            
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    // RAZDVAJANJE KORISNIKA U DVIJE LISTE
    
    const pendingUsers = users.filter(u => !u.approved && u.role !== 'ADMIN'); // Na čekanju su oni koji nisu odobreni i nisu admini
    const approvedUsers = users.filter(u => u.approved && u.role !== 'ADMIN'); // Odobreni su oni koji su odobreni i nisu admini

 // Pomoćna funkcija za iscrtavanje redova u tablici
    const renderTableRows = (userList, showApproveButton) => {
        if (userList.length === 0) {
            return (
                <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '15px' }}>
                        Nema korisnika u ovoj kategoriji.
                    </td>
                </tr>
            );
        }

        return userList.map(user => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{translate(userTypeTranslations, user.userType)}</td>
                <td>{user.userType === 'COMPANY' ? user.companyName : user.fullName}</td>
                <td>{user.oib || '-'}</td>
                <td>{user.address}</td>
                <td>{user.phone || '-'}</td>
                <td>
                    {/* Gumbi se prikazuju SAMO ako je showApproveButton = true (znači, u gornjoj tablici) */}
                    {showApproveButton ? (
                        <>
                            <button 
                                onClick={() => handleApprove(user.id)}
                                style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '5px' }}>
                                Odobri
                            </button>
                            <button 
                                onClick={() => handleDelete(user.id)}
                                style={{ backgroundColor: '#f44336', color: 'white' }}>
                                Obriši
                            </button>
                        </>
                    ) : (
                        // Za donju tablicu ispisujemo samo crticu (ili prazno), nema više brisanja!
                        <span style={{ color: '#888', fontStyle: 'italic' }}>Nema dostupnih akcija</span>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Upravljanje korisnicima</h2>
            
            <button onClick={() => navigate("/admin")} style={{ marginBottom: '20px' }}>
                Natrag
            </button>
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

            {/* TABLICA 1: KORISNICI NA ČEKANJU */}
            <h3 style={{ color: '#d9534f', marginTop: '20px' }}>⏳ Korisnici na čekanju ({pendingUsers.length})</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tip</th>
                        <th>Naziv / Ime</th>
                        <th>OIB</th>
                        <th>Adresa</th>
                        <th>Telefon</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows(pendingUsers, true)}
                </tbody>
            </table>

            {/* TABLICA 2: ODOBRENI KORISNICI */}
            <h3 style={{ color: '#5cb85c', marginTop: '40px' }}>✅ Postojeći korisnici ({approvedUsers.length})</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tip</th>
                        <th>Naziv / Ime</th>
                        <th>OIB</th>
                        <th>Adresa</th>
                        <th>Telefon</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows(approvedUsers, false)}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;
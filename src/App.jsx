// src/App.jsx
// Glavna komponenta aplikacije koja definira rute i navigaciju između stranica. 
// Koristi React Router za upravljanje rutama, a ProtectedRoute komponentu za zaštitu 
// određenih ruta na temelju uloge korisnika. Uključuje rute za login, registraciju, 
// korisnički dashboard, admin dashboard i ostale funkcionalnosti specifične za korisnike i administratore.

// svrha: centralno mjesto za definiranje svih ruta i navigacije u aplikaciji

import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

import CreateWorkOrderPage from './pages/CreateWorkOrderPage'
import MyWorkOrdersPage from './pages/MyWorkOrdersPage'
import MyManifestsPage from './pages/MyManifestsPage'

import AdminWorkOrdersPage from "./pages/AdminWorkOrdersPage"

import AdminReportsPage from "./pages/AdminReportsPage"
import AdminManifestsPage from "./pages/AdminManifestsPage"

import RegisterPage from './pages/RegisterPage';

import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

            <Route
        path="/user/create-work-order"
        element={
          <ProtectedRoute allowedRole="USER">
            <CreateWorkOrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/my-work-orders"
        element={
          <ProtectedRoute allowedRole="USER">
            <MyWorkOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/my-manifests"
        element={
          <ProtectedRoute allowedRole="USER">
            <MyManifestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/work-orders"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminWorkOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manifests"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminManifestsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/users" element={<AdminUsersPage />} />

      
    </Routes>
  )
}

export default App
"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { TicketProvider } from "./contexts/TicketContext"

// Layout
import MainLayout from "./components/Layout/MainLayout"

// Pages
import Dashboard from "./pages/Dashboard"
import TicketsPage from "./pages/TicketsPage"
import MyTicketsPage from "./pages/MyTicketsPage"
import AssignedTicketsPage from "./pages/AssignedTicketsPage"
import NewTicketPage from "./pages/NewTicketPage"
import TicketDetailPage from "./pages/TicketDetailPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import UsersPage from "./pages/UsersPage"

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser } = useAuth()

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if the route requires a specific role
  if (requiredRole) {
    // For admin routes
    if (requiredRole === "admin" && currentUser?.cargo !== "admin") {
      return <Navigate to="/" replace />
    }

    // For support routes (admin can also access support routes)
    if (requiredRole === "suporte" && currentUser?.cargo !== "suporte" && currentUser?.cargo !== "admin") {
      return <Navigate to="/" replace />
    }
  }

  // Check session expiry
  const sessionExpiry = localStorage.getItem("sessionExpiry")
  if (sessionExpiry && Number(sessionExpiry) < Date.now()) {
    // Session expired, redirect to login
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TicketProvider>
          <Routes>
            {/* Public route - Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes - Main Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              <Route path="tickets/new" element={<NewTicketPage />} />
              <Route path="my-tickets" element={<MyTicketsPage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Support/Admin Only Routes */}
              <Route
                path="assigned"
                element={
                  <ProtectedRoute requiredRole="suporte">
                    <AssignedTicketsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes */}
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </TicketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

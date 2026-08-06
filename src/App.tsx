import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { AuthPage } from './pages/AuthPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { ShipperDashboardPage } from './pages/ShipperDashboardPage';
import { FleetDashboardPage } from './pages/FleetDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import type { UserRole } from './types';

// ── Strict Role-Based Protected Route ─────────────────────────────────────────

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: UserRole }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Strict RBAC Verification: If user attempts to access a dashboard outside their role, redirect them to their assigned role dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
};

// ── Public Auth Route (Redirects authenticated users to their dashboard) ──────

const PublicAuthRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <AuthPage />;
};

// ── Root Dispatcher ────────────────────────────────────────────────────────────

const RootDispatcher: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <Navigate to="/auth" replace />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RootDispatcher />} />
        <Route path="auth" element={<PublicAuthRoute />} />
        <Route
          path="dashboard/driver"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriverDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/shipper"
          element={
            <ProtectedRoute allowedRole="shipper">
              <ShipperDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/fleet"
          element={
            <ProtectedRoute allowedRole="fleet">
              <FleetDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RootDispatcher />} />
      </Route>
    </Routes>
  );
}

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

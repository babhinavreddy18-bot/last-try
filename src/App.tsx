import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { ShipperDashboardPage } from './pages/ShipperDashboardPage';
import { FleetDashboardPage } from './pages/FleetDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import type { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: UserRole }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth" element={<AuthPage />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

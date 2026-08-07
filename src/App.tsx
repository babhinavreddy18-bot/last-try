import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { AuthPage } from './pages/AuthPage';
import type { UserRole } from './types';
import { Loader2 } from 'lucide-react';

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DriverDashboardPage = lazy(() => import('./pages/DriverDashboardPage').then(m => ({ default: m.DriverDashboardPage })));
const ShipperDashboardPage = lazy(() => import('./pages/ShipperDashboardPage').then(m => ({ default: m.ShipperDashboardPage })));
const FleetDashboardPage = lazy(() => import('./pages/FleetDashboardPage').then(m => ({ default: m.FleetDashboardPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 text-[#6D4AFF] animate-spin" />
  </div>
);

// ── Strict Role-Based Protected Route ─────────────────────────────────────────

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: UserRole }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // 🛑 STRICT ROLE BOUNDARY: Lock access to user's registered role profile only
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
};

// ── Public Auth Route (Redirects authenticated users to their specific role dashboard) ──────

const PublicAuthRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <AuthPage />;
};

// ── Strict Dashboard Dispatcher (Guards /dashboard root) ─────────────────────

const DashboardDispatcher: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={`/dashboard/${user.role}`} replace />;
};

// ── Root Dispatcher ─────────────────────────────────────────────────────────

const RootDispatcher: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <LandingPage />
    </Suspense>
  );
};

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Pre-login pages: NO navbar, NO layout wrapper ── */}
      <Route path="/" element={<RootDispatcher />} />
      <Route path="/auth" element={<PublicAuthRoute />} />
      <Route path="/dashboard" element={<DashboardDispatcher />} />
      <Route
        path="/features"
        element={
          <Suspense fallback={<PageFallback />}>
            <LandingPage />
          </Suspense>
        }
      />

      {/* ── Authenticated dashboard pages: full Layout with Navbar ── */}
      <Route path="/" element={<Layout />}>
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
      </Route>

      {/* ── Catch-all → landing ── */}
      <Route path="*" element={<RootDispatcher />} />
    </Routes>
  );
}

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

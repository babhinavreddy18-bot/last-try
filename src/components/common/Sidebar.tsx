import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import {
  Truck, PackageCheck, Building2, ShieldAlert,
  MapPin, FileCheck, Sparkles, Leaf, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  roleAllowed: UserRole;
}

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();

  const userRole = role || 'shipper';

  const dashboardItems: Record<UserRole, NavItem> = {
    driver: { label: 'Driver Portal', path: '/dashboard/driver', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#0D9488' },
    shipper: { label: 'Shipper Hub', path: '/dashboard/shipper', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#2563EB' },
    fleet: { label: 'Fleet Command', path: '/dashboard/fleet', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#D97706' },
    admin: { label: 'Admin Telemetry', path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#DC2626' },
  };

  const aiIntelligenceItems: Record<UserRole, NavItem[]> = {
    driver: [
      { label: 'Document Scanner', path: '/dashboard/driver', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#0D9488' },
      { label: 'AI Return Load Matcher', path: '/dashboard/driver', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'driver', color: '#2563EB' },
    ],
    shipper: [
      { label: 'Freight Pricing Engine', path: '/dashboard/shipper', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#7C3AED' },
      { label: 'Dynamic Benchmarks', path: '/dashboard/shipper', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#2563EB' },
    ],
    fleet: [
      { label: 'Fleet Availability Predictor', path: '/dashboard/fleet', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#D97706' },
      { label: 'Carbon Sustainability Hub', path: '/dashboard/fleet', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#059669' },
    ],
    admin: [
      { label: 'Tampering Anomalies', path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#DC2626' },
      { label: 'Telemetry Monitoring', path: '/dashboard/admin', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#7C3AED' },
    ],
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  return (
    <aside
      className="w-64 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] backdrop-blur-md"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        borderRight: '1px solid #E2E8F0',
      }}
    >
      <div className="space-y-6">
        {/* Role Portal Section */}
        <div>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
            My Workspace
          </h4>
          <nav className="space-y-1">
            <NavLink
              to={currentDashboardItem.path}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs',
                location.pathname === currentDashboardItem.path
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-blue-600">
                  {currentDashboardItem.icon}
                </span>
                <span>{currentDashboardItem.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
            </NavLink>
          </nav>
        </div>

        {/* AI Intelligence Modules for Role */}
        <div>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600 px-3 mb-2">
            Role AI Modules
          </h4>
          <nav className="space-y-1">
            {currentAiItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Role active status badge */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="capitalize">{userRole} Scope Active</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Strict RBAC active. Showing features authorized for {userRole} role.
        </p>
      </div>
    </aside>
  );
};

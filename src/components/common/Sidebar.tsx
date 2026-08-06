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
    driver: { label: 'Driver Portal', path: '/dashboard/driver', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#34D399' },
    shipper: { label: 'Shipper Hub', path: '/dashboard/shipper', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#60A5FA' },
    fleet: { label: 'Fleet Command', path: '/dashboard/fleet', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#FBBF24' },
    admin: { label: 'Admin Telemetry', path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#F87171' },
  };

  const aiIntelligenceItems: Record<UserRole, NavItem[]> = {
    driver: [
      { label: 'Document Scanner', path: '/dashboard/driver', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#34D399' },
      { label: 'AI Return Load Matcher', path: '/dashboard/driver', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'driver', color: '#60A5FA' },
    ],
    shipper: [
      { label: 'Freight Pricing Engine', path: '/dashboard/shipper', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#A78BFA' },
      { label: 'Dynamic Benchmarks', path: '/dashboard/shipper', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#60A5FA' },
    ],
    fleet: [
      { label: 'Fleet Availability Predictor', path: '/dashboard/fleet', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#FBBF24' },
      { label: 'Carbon Sustainability Hub', path: '/dashboard/fleet', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#34D399' },
    ],
    admin: [
      { label: 'Tampering Anomalies', path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#F87171' },
      { label: 'Telemetry Monitoring', path: '/dashboard/admin', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#A78BFA' },
    ],
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  return (
    <aside
      className="w-64 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]"
      style={{
        background: 'rgba(8,12,24,0.70)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99,102,241,0.18)',
      }}
    >
      <div className="space-y-6">
        {/* Role Portal Section */}
        <div>
          <h4
            className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2"
            style={{ color: '#6366F1AA' }}
          >
            My Workspace
          </h4>
          <nav className="space-y-1">
            <NavLink
              to={currentDashboardItem.path}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
              )}
              style={location.pathname === currentDashboardItem.path ? {
                background: `${currentDashboardItem.color}22`,
                border: `1px solid ${currentDashboardItem.color}40`,
                color: currentDashboardItem.color,
                boxShadow: `0 0 12px ${currentDashboardItem.color}25`,
              } : {
                color: '#64748B',
                border: '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ color: currentDashboardItem.color }}>
                  {currentDashboardItem.icon}
                </span>
                <span>{currentDashboardItem.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: currentDashboardItem.color }} />
            </NavLink>
          </nav>
        </div>

        {/* AI Intelligence Modules for Role */}
        <div>
          <h4
            className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2"
            style={{ color: '#14B8A6AA' }}
          >
            Role AI Modules
          </h4>
          <nav className="space-y-1">
            {currentAiItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group"
                style={{
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)',
                }}
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
      <div
        className="p-3 rounded-xl space-y-2"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 20px rgba(99,102,241,0.1)',
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#A5B4FC' }}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="capitalize">{userRole} Scope Active</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
          Strict RBAC active. Showing features authorized for {userRole} role.
        </p>
      </div>
    </aside>
  );
};

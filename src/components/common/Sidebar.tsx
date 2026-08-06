import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import {
  Truck, PackageCheck, Building2, ShieldAlert,
  MapPin, FileCheck, Sparkles, Leaf, ChevronRight, Sun, Moon
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
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();

  const userRole = role || 'shipper';

  const dashboardItems: Record<UserRole, NavItem> = {
    driver: { label: t.driverPortal, path: '/dashboard/driver', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#0D9488' },
    shipper: { label: t.shipperHub, path: '/dashboard/shipper', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#2563EB' },
    fleet: { label: t.fleetCommand, path: '/dashboard/fleet', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#D97706' },
    admin: { label: t.adminTelemetry, path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#DC2626' },
  };

  const aiIntelligenceItems: Record<UserRole, NavItem[]> = {
    driver: [
      { label: t.documentScanner, path: '/dashboard/driver#document-scanner', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#0D9488' },
      { label: t.returnLoadMatcher, path: '/dashboard/driver#return-load-matcher', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'driver', color: '#2563EB' },
    ],
    shipper: [
      { label: t.freightPricingEngine, path: '/dashboard/shipper', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#7C3AED' },
      { label: t.dynamicBenchmarks, path: '/dashboard/shipper', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#2563EB' },
    ],
    fleet: [
      { label: t.fleetPredictor, path: '/dashboard/fleet', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#D97706' },
      { label: t.carbonHub, path: '/dashboard/fleet', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#059669' },
    ],
    admin: [
      { label: t.tamperingAlerts, path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#DC2626' },
      { label: t.aiPlatform, path: '/dashboard/admin', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#7C3AED' },
    ],
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  return (
    <aside className="w-64 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 z-20 glass-panel">
      <div className="space-y-6">
        {/* Role Portal Section */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 px-3 mb-2">
            {t.myWorkspace}
          </h4>
          <nav className="space-y-1">
            <NavLink
              to={currentDashboardItem.path}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs',
                location.pathname === currentDashboardItem.path
                  ? 'bg-blue-600 text-white shadow-sm border border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={location.pathname === currentDashboardItem.path ? 'text-white' : 'text-blue-600 dark:text-indigo-400'}>
                  {currentDashboardItem.icon}
                </span>
                <span>{currentDashboardItem.label}</span>
              </div>
              <ChevronRight className={location.pathname === currentDashboardItem.path ? 'text-white w-3.5 h-3.5' : 'text-slate-400 w-3.5 h-3.5'} />
            </NavLink>
          </nav>
        </div>

        {/* AI Intelligence Modules for Role */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400 px-3 mb-2">
            {t.roleAiModules}
          </h4>
          <nav className="space-y-1">
            {currentAiItems.map((item, idx) => {
              const isActive = (location.pathname + location.hash) === item.path;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs group',
                    isActive
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300 border border-blue-300 dark:border-indigo-700 font-extrabold'
                      : 'bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: item.color }} className="group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="group-hover:text-blue-700 transition-colors">{item.label}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full shadow-2xs" style={{ background: item.color }} />
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="space-y-3">
        {/* Quick Theme Switcher Pill in Sidebar */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-extrabold transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>Theme Mode</span>
          </span>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
            {theme}
          </span>
        </button>

        {/* Role active status badge */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
            <span className="capitalize">{userRole} Scope Active</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            Strict RBAC active. Showing features authorized for {userRole} role.
          </p>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import {
  Truck, PackageCheck, Building2, ShieldAlert,
  MapPin, FileCheck, Sparkles, Leaf, ChevronRight, Database
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  roleAllowed: UserRole;
}

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false, onCloseMobile }) => {
  const { role } = useAuth();
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
      { label: t.freightPricingEngine, path: '/dashboard/shipper#nlp-pricing', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#7C3AED' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/shipper#erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'shipper', color: '#0D9488' },
      { label: t.dynamicBenchmarks, path: '/dashboard/shipper#dynamic-benchmarks', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#2563EB' },
    ],
    fleet: [
      { label: t.fleetPredictor, path: '/dashboard/fleet#availability-predictor', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#D97706' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/fleet#erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'fleet', color: '#0D9488' },
      { label: t.carbonHub, path: '/dashboard/fleet#carbon-hub', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#059669' },
    ],
    admin: [
      { label: t.tamperingAlerts, path: '/dashboard/admin#security-alerts', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#DC2626' },
      { label: t.aiPlatform, path: '/dashboard/admin#system-telemetry', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#7C3AED' },
    ],
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  const sidebarContent = (
    <>
      <div className="space-y-6">
        {/* Role Portal Section */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] px-3 mb-2">
            {t.myWorkspace}
          </h4>
          <nav className="space-y-1">
            <NavLink
              to={currentDashboardItem.path}
              className={clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs',
                location.pathname === currentDashboardItem.path
                  ? 'bg-[#2563EB] text-white shadow-sm font-extrabold'
                  : 'bg-white text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={location.pathname === currentDashboardItem.path ? 'text-white' : 'text-[#2563EB]'}>
                  {currentDashboardItem.icon}
                </span>
                <span>{currentDashboardItem.label}</span>
              </div>
              <ChevronRight className={location.pathname === currentDashboardItem.path ? 'text-white w-3.5 h-3.5' : 'text-[#94A3B8] w-3.5 h-3.5'} />
            </NavLink>
          </nav>
        </div>

        {/* AI Intelligence Modules for Role */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] px-3 mb-2">
            {t.roleAiModules}
          </h4>
          <nav className="space-y-1">
            {currentAiItems.map((item, idx) => {
              const currentFull = location.pathname + location.hash;
              const isActive = currentFull === item.path || (location.hash && item.path.includes(location.hash));
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => {
                    if (item.path.includes('#')) {
                      const hashPart = item.path.substring(item.path.indexOf('#') + 1);
                      const targetId = hashPart.startsWith('ai-') ? hashPart : 'ai-' + hashPart;
                      const el = document.getElementById(targetId) || document.getElementById(hashPart);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={clsx(
                    'flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs group',
                    isActive
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-extrabold'
                      : 'bg-white text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#2563EB]' : 'text-[#64748B] group-hover:text-[#2563EB] transition-colors'}>
                      {item.icon}
                    </span>
                    <span className="group-hover:text-[#2563EB] transition-colors">{item.label}</span>
                  </div>
                  <span className={clsx('w-2 h-2 rounded-full', isActive ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]')} />
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="space-y-3">
        {/* Role active status badge */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span className="capitalize">{userRole} Scope Active</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed font-semibold">
            Strict RBAC active. Authorized for {userRole} role.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 z-20 bg-white border-r border-[#E2E8F0] shadow-2xs">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 border-r border-[#E2E8F0] animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

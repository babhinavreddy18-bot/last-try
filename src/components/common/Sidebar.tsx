import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import {
  Truck, PackageCheck, Building2, ShieldAlert,
  MapPin, FileCheck, Sparkles, Leaf, ChevronRight, Database,
  Zap
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
    driver: { label: t.driverPortal, path: '/dashboard/driver', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#6D4AFF' },
    shipper: { label: t.shipperHub, path: '/dashboard/shipper', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF' },
    fleet: { label: t.fleetCommand, path: '/dashboard/fleet', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#6D4AFF' },
    admin: { label: t.adminTelemetry, path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#6D4AFF' },
  };

  const aiIntelligenceItems: Record<UserRole, NavItem[]> = {
    driver: [
      { label: t.documentScanner, path: '/dashboard/driver#document-scanner', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#6D4AFF' },
      { label: t.returnLoadMatcher, path: '/dashboard/driver#return-load-matcher', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'driver', color: '#F97316' },
    ],
    shipper: [
      { label: t.freightPricingEngine, path: '/dashboard/shipper#nlp-pricing', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#F97316' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/shipper#erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF' },
      { label: t.dynamicBenchmarks, path: '/dashboard/shipper#dynamic-benchmarks', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF' },
    ],
    fleet: [
      { label: t.fleetPredictor, path: '/dashboard/fleet#availability-predictor', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#6D4AFF' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/fleet#erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'fleet', color: '#6D4AFF' },
      { label: t.carbonHub, path: '/dashboard/fleet#carbon-hub', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#22C55E' },
    ],
    admin: [
      { label: t.tamperingAlerts, path: '/dashboard/admin#security-alerts', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#EF4444' },
      { label: t.aiPlatform, path: '/dashboard/admin#system-telemetry', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#F97316' },
    ],
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  const sidebarContent = (
    <>
      <div className="space-y-8">
        {/* Role Portal Section */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] px-3 mb-3">
            {t.myWorkspace}
          </h4>
          <nav className="space-y-1">
            <NavLink
              to={currentDashboardItem.path}
              className={clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all',
                location.pathname === currentDashboardItem.path
                  ? 'sidebar-active'
                  : 'text-[#374151] hover:bg-[#F5F3FF] hover:text-[#6D4AFF]'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={location.pathname === currentDashboardItem.path ? 'text-white' : 'text-[#6D4AFF]'}>
                  {currentDashboardItem.icon}
                </span>
                <span>{currentDashboardItem.label}</span>
              </div>
              <ChevronRight className={clsx('w-3.5 h-3.5', location.pathname === currentDashboardItem.path ? 'text-white/70' : 'text-[#D1D5DB]')} />
            </NavLink>
          </nav>
        </div>

        {/* AI Intelligence Modules */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] px-3 mb-3">
            {t.roleAiModules}
          </h4>
          <nav className="space-y-1">
            {currentAiItems.map((item, idx) => {
              const currentFull = location.pathname + location.hash;
              const isActive = currentFull === item.path || (location.hash && item.path.includes(location.hash));
              const isOrange = item.color === '#F97316';
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => {
                    if (item.path.includes('#')) {
                      const hashPart = item.path.substring(item.path.indexOf('#') + 1);
                      const targetId = hashPart.startsWith('ai-') ? hashPart : 'ai-' + hashPart;
                      window.location.hash = hashPart;
                      const el = document.getElementById(targetId) || document.getElementById(hashPart);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        el.classList.add('ring-2', 'ring-[#6D4AFF]', 'ring-offset-2', 'transition-all', 'duration-500');
                        setTimeout(() => {
                          el.classList.remove('ring-2', 'ring-[#6D4AFF]', 'ring-offset-2');
                        }, 2000);
                      }
                    }
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group',
                    isActive
                      ? 'bg-[#EDE9FE] text-[#6D4AFF] border border-[#DDD6FE]'
                      : 'text-[#374151] hover:bg-[#F5F3FF] hover:text-[#6D4AFF]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      isActive ? 'text-[#6D4AFF]' : isOrange ? 'text-[#F97316] group-hover:text-[#6D4AFF]' : 'text-[#6B7280] group-hover:text-[#6D4AFF]',
                      'transition-colors'
                    )}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isOrange && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role status card */}
      <div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] border border-[#DDD6FE] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF]">
            <Zap className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="capitalize">{userRole} Portal Active</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#6D4AFF] animate-pulse" />
          </div>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            RBAC enforced. Authorized for {userRole} role.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 z-20 bg-white/80 backdrop-blur-sm border-r border-[#E5E7EB]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 border-r border-[#E5E7EB] animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

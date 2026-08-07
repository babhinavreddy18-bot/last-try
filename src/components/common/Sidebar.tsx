import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  targetId: string;
  icon: React.ReactNode;
  color: string;
  roleAllowed: UserRole;
  desc?: string;
}

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false, onCloseMobile }) => {
  const { role, loginAsRole } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = role || 'shipper';

  const dashboardItems: Record<UserRole, NavItem> = {
    driver: { label: t.driverPortal, path: '/dashboard/driver', targetId: 'top', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#22C55E' },
    shipper: { label: t.shipperHub, path: '/dashboard/shipper', targetId: 'top', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF' },
    fleet: { label: t.fleetCommand, path: '/dashboard/fleet', targetId: 'top', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#F97316' },
    admin: { label: t.adminTelemetry, path: '/dashboard/admin', targetId: 'top', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#EF4444' },
  };

  const aiIntelligenceItems: Record<UserRole, NavItem[]> = {
    driver: [
      { label: t.documentScanner, path: '/dashboard/driver#ai-document-scanner', targetId: 'ai-document-scanner', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#6D4AFF', desc: 'OCR Trust Check' },
      { label: t.returnLoadMatcher, path: '/dashboard/driver#ai-return-load-matcher', targetId: 'ai-return-load-matcher', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'driver', color: '#F97316', desc: 'Backhaul Profit AI' },
      { label: 'Live GPS Navigation', path: '/dashboard/driver#live-navigation-map', targetId: 'live-navigation-map', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'driver', color: '#22C55E', desc: 'Real-time Route AI' },
    ],
    shipper: [
      { label: t.freightPricingEngine, path: '/dashboard/shipper#ai-nlp-pricing', targetId: 'ai-nlp-pricing', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#F97316', desc: 'NLP Instant Quotes' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/shipper#ai-erp-wms-sharing', targetId: 'ai-erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF', desc: 'Live Inventory Sync' },
      { label: t.dynamicBenchmarks, path: '/dashboard/shipper#ai-dynamic-benchmarks', targetId: 'ai-dynamic-benchmarks', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'shipper', color: '#6D4AFF', desc: 'Market Rate Telemetry' },
    ],
    fleet: [
      { label: t.fleetPredictor, path: '/dashboard/fleet#ai-availability-predictor', targetId: 'ai-availability-predictor', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#6D4AFF', desc: 'Predictive Utilization' },
      { label: 'ERP & WMS Data Hub', path: '/dashboard/fleet#ai-erp-wms-sharing', targetId: 'ai-erp-wms-sharing', icon: <Database className="w-4 h-4" />, roleAllowed: 'fleet', color: '#6D4AFF', desc: 'Supply Chain Integration' },
      { label: t.carbonHub, path: '/dashboard/fleet#ai-carbon-hub', targetId: 'ai-carbon-hub', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#22C55E', desc: 'Green Logistics Index' },
    ],
    admin: [
      { label: t.tamperingAlerts, path: '/dashboard/admin#ai-security-alerts', targetId: 'ai-security-alerts', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#EF4444', desc: 'Security Monitor' },
      { label: t.aiPlatform, path: '/dashboard/admin#ai-system-telemetry', targetId: 'ai-system-telemetry', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'admin', color: '#F97316', desc: 'System Telemetry' },
    ],
  };

  const handleNavigateToAiModule = (targetRole: UserRole, targetId: string) => {
    if (role !== targetRole) {
      loginAsRole(targetRole);
    }

    const basePath = `/dashboard/${targetRole}`;
    if (location.pathname !== basePath) {
      navigate(`${basePath}#${targetId}`);
    } else {
      window.location.hash = targetId;
    }

    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-[#6D4AFF]', 'ring-offset-2', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#6D4AFF]', 'ring-offset-2');
        }, 2000);
      }
    }, 150);

    if (onCloseMobile) onCloseMobile();
  };

  const currentDashboardItem = dashboardItems[userRole];
  const currentAiItems = aiIntelligenceItems[userRole] || [];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between gap-6">
      <div className="space-y-6">
        {/* Current Workspace Link */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] px-2 mb-2">
            {t.myWorkspace}
          </h4>
          <NavLink
            to={currentDashboardItem.path}
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
            }}
            className={clsx(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all',
              location.pathname === currentDashboardItem.path
                ? 'sidebar-active'
                : 'text-[#374151] hover:bg-[#F5F3FF] hover:text-[#6D4AFF]'
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className={location.pathname === currentDashboardItem.path ? 'text-white' : 'text-[#6D4AFF]'}>
                {currentDashboardItem.icon}
              </span>
              <span>{currentDashboardItem.label}</span>
            </div>
            <ChevronRight className={clsx('w-3.5 h-3.5', location.pathname === currentDashboardItem.path ? 'text-white/70' : 'text-[#D1D5DB]')} />
          </NavLink>
        </div>

        {/* AI Intelligence Modules Buttons */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              {t.roleAiModules}
            </h4>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#F97316]">
              <Sparkles className="w-2.5 h-2.5 animate-spin" />
              Direct AI
            </span>
          </div>

          <nav className="space-y-1.5">
            {currentAiItems.map((item, idx) => {
              const currentFull = location.pathname + location.hash;
              const isActive = currentFull === item.path || (location.hash && item.path.includes(location.hash));
              const isOrange = item.color === '#F97316';
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleNavigateToAiModule(userRole, item.targetId)}
                  className={clsx(
                    'w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group cursor-pointer border',
                    isActive
                      ? 'bg-[#EDE9FE] text-[#6D4AFF] border-[#DDD6FE] shadow-sm'
                      : 'bg-white/60 text-[#374151] border-transparent hover:bg-[#F5F3FF] hover:text-[#6D4AFF] hover:border-[#DDD6FE]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={clsx(
                      'p-1.5 rounded-xl transition-colors shrink-0',
                      isActive ? 'bg-[#6D4AFF] text-white' : 'bg-[#F3F4F6] text-[#6D4AFF] group-hover:bg-[#EDE9FE]'
                    )}>
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{item.label}</div>
                      {item.desc && (
                        <div className="text-[10px] text-[#6B7280] font-normal truncate">{item.desc}</div>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 flex items-center gap-1">
                    {isOrange && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
                    )}
                    <ChevronRight className="w-3 h-3 text-[#9CA3AF] group-hover:text-[#6D4AFF] group-hover:translate-x-0.5 transition-all" />
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role status footer card */}
      <div className="pt-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] border border-[#DDD6FE] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF]">
            <Zap className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="capitalize">{userRole} Portal Active</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
          <p className="text-[10px] text-[#6B7280] leading-relaxed">
            Role-based access active. Click any AI module button above to navigate directly.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between p-4 fixed top-16 left-0 bottom-0 z-30 bg-white/90 backdrop-blur-md border-r border-[#E5E7EB] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 border-r border-[#E5E7EB] animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};


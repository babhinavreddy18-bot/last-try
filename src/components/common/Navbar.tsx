import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import { Sparkles, Bell, Truck, UserCheck, Shield, LogOut, CheckCircle2, AlertTriangle, Info, Globe, ChevronDown, Menu, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from './Badge';
import { TruckLogo } from './TruckLogo';

interface NavbarProps {
  onOpenCopilot: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, onToggleMobileMenu }) => {
  const { user, role, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const activeRole = role || 'shipper';
  const activeLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const isUnauthenticatedPage = !user || location.pathname === '/' || location.pathname === '/auth';

  const notifications = [
    { id: 'n1', title: 'Document Verified', desc: 'Driver DL-MH12202000101 passed Gemini OCR trust check.', time: '2m ago', type: 'success' },
    { id: 'n2', title: 'New Rate Benchmark', desc: 'Freight rates for Mumbai → Pune dropped 4.2%.', time: '15m ago', type: 'info' },
    { id: 'n3', title: 'GPS Telemetry Alert', desc: 'Truck MH-12-CL-3012 back on optimal NH-48 route.', time: '45m ago', type: 'warning' },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: 'blue' | 'teal' | 'amber' | 'red'; icon: React.ReactNode }> = {
    driver: { label: t.driverPortal, badge: 'teal', icon: <Truck className="w-3.5 h-3.5" /> },
    shipper: { label: t.shipperHub, badge: 'blue', icon: <UserCheck className="w-3.5 h-3.5" /> },
    fleet: { label: t.fleetCommand, badge: 'amber', icon: <Truck className="w-3.5 h-3.5" /> },
    admin: { label: t.adminTelemetry, badge: 'red', icon: <Shield className="w-3.5 h-3.5" /> },
  };

  return (
    <header className="sticky top-0 z-30 h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between bg-white border-b border-[#E2E8F0] shadow-2xs relative text-[#0F172A]">
      {/* Top Subtle Electric Blue Bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2563EB]" />

      {/* Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!isUnauthenticatedPage && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] md:hidden cursor-pointer transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-[#0F172A]" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer transition-opacity hover:opacity-90" title="Return to CargoLoop Home">
          <TruckLogo size="sm" />
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
              {t.platformName}
            </span>
            <span className="text-[10px] font-bold ml-1.5 px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hidden sm:inline-block">
              {t.aiPlatform}
            </span>
          </div>
        </Link>

        {!isUnauthenticatedPage && (
          <>
            <div className="h-5 w-px mx-0.5 bg-[#E2E8F0] hidden sm:block" />
            <div className="hidden sm:block">
              <Badge variant={roleLabels[activeRole].badge} icon={roleLabels[activeRole].icon}>
                {roleLabels[activeRole].label}
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Center Search Input (Shown only in authenticated dashboard) */}
      {!isUnauthenticatedPage && (
        <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 w-64 lg:w-80 focus-within:border-[#2563EB] focus-within:bg-white transition-all shadow-2xs">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input
            type="text"
            placeholder="Search shipments, carriers..."
            className="bg-transparent text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none w-full font-medium"
          />
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 🌐 5 Major Indian Spoken Languages Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Translate CargoLoop into 5 Major Indian Languages"
          >
            <Globe className="w-4 h-4 text-[#2563EB]" />
            <span className="text-[11px] sm:text-xs font-extrabold">{activeLangObj.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B] hidden sm:block" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] uppercase font-black text-[#64748B] tracking-wider">
                5 Major Indian Languages
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    lang === l.code
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] font-semibold opacity-75">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Page Navigation Button for Unauthenticated Visitors */}
        {isUnauthenticatedPage && location.pathname !== '/auth' && (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <span>Go to Login Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {isUnauthenticatedPage && location.pathname === '/auth' && (
          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Back to Features</span>
          </Link>
        )}

        {/* Authenticated Controls */}
        {!isUnauthenticatedPage && (
          <>
            {/* AI Copilot */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-extrabold text-white rounded-xl shadow-md bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{t.aiCopilot}</span>
              <span className="sm:hidden text-[10px]">AI</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] transition-all relative shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#0F172A]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-3 z-50 space-y-2 bg-white border border-[#E2E8F0] shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] text-xs">
                    <span className="font-extrabold text-[#0F172A]">{t.telemetryAlerts}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">3 New</span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl space-y-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5 text-[#0F172A]">
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {n.type === 'info' && <Info className="w-3.5 h-3.5 text-[#2563EB]" />}
                          {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-bold">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-normal font-medium">{n.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar & Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#2563EB] shadow-2xs"
                />
                <button
                  onClick={logout}
                  title={t.signOut}
                  className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-[#E2E8F0] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

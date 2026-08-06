import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import { Sparkles, Bell, Truck, UserCheck, Shield, LogOut, CheckCircle2, AlertTriangle, Info, Globe, ChevronDown, Menu, Search } from 'lucide-react';
import { Badge } from './Badge';

import { Link } from 'react-router-dom';
import { TruckLogo } from './TruckLogo';

interface NavbarProps {
  onOpenCopilot: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, onToggleMobileMenu }) => {
  const { user, role, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const activeRole = role || 'shipper';
  const activeLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

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
    <header className="sticky top-0 z-30 h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between bg-[#12131C] border-b border-[#1F2133] relative text-white">
      {/* Top Gradient Highlight Bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 opacity-90" />
      {/* Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-xl border border-[#1F2133] bg-[#181926] text-slate-200 md:hidden cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer transition-opacity hover:opacity-90" title="Return to Home Dashboard">
          <TruckLogo size="sm" />
          <div className="hidden xs:block sm:block">
            <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-purple-400 transition-colors">
              {t.platformName}
            </span>
            <span className="text-[10px] font-extrabold ml-1.5 px-1.5 py-0.5 rounded border bg-purple-500/20 text-purple-300 border-purple-500/35 hidden sm:inline-block">
              {t.aiPlatform}
            </span>
          </div>
        </Link>

        <div className="h-5 w-px mx-0.5 bg-[#1F2133] hidden sm:block" />

        <div className="hidden sm:block">
          <Badge variant={roleLabels[activeRole].badge} icon={roleLabels[activeRole].icon}>
            {roleLabels[activeRole].label}
          </Badge>
        </div>
      </div>

      {/* Center Search Input matching reference image */}
      <div className="hidden md:flex items-center gap-2 bg-[#181926] border border-[#26283D] rounded-xl px-3 py-1.5 w-64 lg:w-80 focus-within:border-purple-500 transition-colors">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent text-xs text-white placeholder-slate-400 outline-none w-full font-medium"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Info Avatar matching reference image */}
        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-[#181926] border border-[#26283D]">
            <img
              src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80`}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-purple-400/40"
            />
            <span className="text-xs font-bold text-white hidden sm:inline">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}

        {/* 🌐 5 Major Indian Spoken Languages Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-extrabold transition-all shadow-xs cursor-pointer"
            title="Translate CargoLoop into 5 Major Indian Languages"
          >
            <Globe className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
            <span className="text-[11px] sm:text-xs font-black">{activeLangObj.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 hidden sm:block" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">
                5 Major Indian Languages
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    lang === l.code
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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

        {/* AI Copilot */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-black text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">{t.aiCopilot}</span>
          <span className="sm:hidden text-[10px]">AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all relative shadow-xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-3 z-50 space-y-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">{t.telemetryAlerts}</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-indigo-900/50 text-blue-700 dark:text-indigo-300 border border-blue-200 dark:border-indigo-800">3 New</span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl space-y-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-blue-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                      {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600" />}
                      {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-medium">{n.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar & logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 shadow-xs"
            />
            <button
              onClick={logout}
              title={t.signOut}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import { Sparkles, Bell, Truck, UserCheck, Shield, LogOut, CheckCircle2, AlertTriangle, Info, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { Badge } from './Badge';

interface NavbarProps {
  onOpenCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between glass-panel">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base tracking-wider shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            }}
          >
            CL
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-lg tracking-tight text-gradient-blue">
              {t.platformName}
            </span>
            <span
              className="text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded border"
              style={{
                background: theme === 'dark' ? 'rgba(99,102,241,0.2)' : '#EFF6FF',
                color: theme === 'dark' ? '#A5B4FC' : '#2563EB',
                borderColor: theme === 'dark' ? 'rgba(99,102,241,0.35)' : '#BFDBFE',
              }}
            >
              {t.aiPlatform}
            </span>
          </div>
        </div>
        <div className="h-5 w-px mx-1 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        <Badge variant={roleLabels[activeRole].badge} icon={roleLabels[activeRole].icon}>
          {roleLabels[activeRole].label}
        </Badge>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* User Info */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold">{user.name}</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-indigo-900/60 text-blue-700 dark:text-indigo-300">
              {user.role}
            </span>
          </div>
        )}

        {/* 🌐 5 Major Indian Spoken Languages Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
            title="Translate CargoLoop into 5 Major Indian Languages"
          >
            <Globe className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{activeLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                5 Major Indian Languages
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    lang === l.code
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sun / Moon Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold hidden sm:inline">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold hidden sm:inline">Light</span>
            </>
          )}
        </button>

        {/* AI Copilot */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-sm hover:shadow transition-all group"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>{t.aiCopilot}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-3 z-50 space-y-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold">{t.telemetryAlerts}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-indigo-900/50 text-blue-600 dark:text-indigo-300">3 New</span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl space-y-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-500" />}
                      {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{n.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar & logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <button
              onClick={logout}
              title={t.signOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

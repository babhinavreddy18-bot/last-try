import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import {
  Sparkles, Bell, LogOut,
  CheckCircle2, AlertTriangle, Info, Globe, ChevronDown, Menu,
  ArrowRight, ArrowLeft, Zap
} from 'lucide-react';
import { TruckLogo } from './TruckLogo';
import clsx from 'clsx';

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
  const isUnauthenticatedPage = !user;

  const notifications = [
    { id: 'n1', title: 'Document Verified', desc: 'Driver DL-MH12202000101 passed Gemini OCR trust check.', time: '2m ago', type: 'success' },
    { id: 'n2', title: 'New Rate Benchmark', desc: 'Freight rates for Mumbai → Pune dropped 4.2%.', time: '15m ago', type: 'info' },
    { id: 'n3', title: 'GPS Telemetry Alert', desc: 'Truck MH-12-CL-3012 back on optimal NH-48 route.', time: '45m ago', type: 'warning' },
  ];

  const roleColors: Record<UserRole, string> = {
    driver: '#22C55E',
    shipper: '#6D4AFF',
    fleet: '#F97316',
    admin: '#EF4444',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px] px-4 sm:px-6 flex items-center justify-between navbar-floating">

      {/* Logo & Left Controls */}
      <div className="flex items-center gap-3">
        {!isUnauthenticatedPage && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F5F3FF] hover:border-[#DDD6FE] md:hidden cursor-pointer transition-all"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          title="CargoLoop Home"
        >
          <TruckLogo size="sm" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#111827] group-hover:text-[#6D4AFF] transition-colors">
              {t.platformName}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#00f3ff]/10 text-[#00cce5] dark:text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
              <Zap className="w-2.5 h-2.5 text-[#00f3ff] animate-pulse" />
              AI ACTIVE
            </span>
          </div>
        </Link>
        {/* Locked role badge — authenticated only */}
        {!isUnauthenticatedPage && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
            style={{
              background: `${roleColors[activeRole]}14`,
              color: roleColors[activeRole],
              borderColor: `${roleColors[activeRole]}30`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: roleColors[activeRole] }} />
            <span className="capitalize">{activeRole} Profile</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F5F3FF] hover:border-[#DDD6FE] text-[#111827] text-xs font-semibold transition-all cursor-pointer"
            title="Select Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span>{activeLangObj.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-[#6B7280] hidden sm:block" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_8px_28px_rgba(109,74,255,0.12)] p-2 z-50 space-y-0.5">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">
                5 Major Indian Languages
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={clsx(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
                    lang === l.code
                      ? 'bg-[#6D4AFF] text-white'
                      : 'text-[#111827] hover:bg-[#F5F3FF] hover:text-[#6D4AFF]'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] opacity-70">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Unauthenticated page nav buttons ── */}
        {isUnauthenticatedPage && location.pathname !== '/auth' && (
          <Link
            to="/auth"
            className="btn-purple text-xs py-2 px-5 rounded-full"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {isUnauthenticatedPage && location.pathname === '/auth' && (
          <Link
            to="/"
            className="btn-outline text-xs py-2 px-5 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span>View Features</span>
          </Link>
        )}

        {/* ── Authenticated controls ── */}
        {!isUnauthenticatedPage && (
          <>
            {/* AI Copilot */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFEDD5]" />
              <span className="hidden sm:inline">{t.aiCopilot}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F5F3FF] hover:border-[#DDD6FE] transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F97316] animate-pulse border border-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl p-3 z-50 space-y-2 bg-white border border-[#E5E7EB] shadow-[0_8px_28px_rgba(109,74,255,0.12)]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6] text-xs">
                    <span className="font-bold text-[#111827]">{t.telemetryAlerts}</span>
                    <span className="badge-orange">3 New</span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl space-y-1 bg-[#F9FAFB] border border-[#F3F4F6] hover:bg-[#F5F3FF] hover:border-[#EDE9FE] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold flex items-center gap-1.5 text-[#111827]">
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                          {n.type === 'info' && <Info className="w-3.5 h-3.5 text-[#6D4AFF]" />}
                          {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />}
                          {n.title}
                        </span>
                        <span className="text-[#6B7280]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar & Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#DDD6FE]"
                />
                <button
                  onClick={logout}
                  title={t.signOut}
                  className="p-1.5 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl transition-colors border border-[#E5E7EB] cursor-pointer"
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

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { Sparkles, Bell, Truck, UserCheck, Shield, LogOut, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Badge } from './Badge';

interface NavbarProps {
  onOpenCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const { user, role, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const activeRole = role || 'shipper';

  const notifications = [
    { id: 'n1', title: 'Document Verified', desc: 'Driver DL-MH12202000101 passed Gemini OCR trust check.', time: '2m ago', type: 'success' },
    { id: 'n2', title: 'New Rate Benchmark', desc: 'Freight rates for Mumbai → Pune dropped 4.2%.', time: '15m ago', type: 'info' },
    { id: 'n3', title: 'GPS Telemetry Alert', desc: 'Truck MH-12-CL-3012 back on optimal NH-48 route.', time: '45m ago', type: 'warning' },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: 'blue' | 'teal' | 'amber' | 'red'; icon: React.ReactNode }> = {
    driver: { label: 'Driver Portal', badge: 'teal', icon: <Truck className="w-3.5 h-3.5" /> },
    shipper: { label: 'Shipper Hub', badge: 'blue', icon: <UserCheck className="w-3.5 h-3.5" /> },
    fleet: { label: 'Fleet Command', badge: 'amber', icon: <Truck className="w-3.5 h-3.5" /> },
    admin: { label: 'Admin Telemetry', badge: 'red', icon: <Shield className="w-3.5 h-3.5" /> },
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between backdrop-blur-md"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
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
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              CargoLoop
            </span>
            <span
              className="text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded border"
              style={{
                background: '#EFF6FF',
                color: '#2563EB',
                borderColor: '#BFDBFE',
              }}
            >
              AI Platform
            </span>
          </div>
        </div>
        <div className="h-5 w-px mx-1 bg-slate-200 hidden sm:block" />
        <Badge variant={roleLabels[activeRole].badge} icon={roleLabels[activeRole].icon}>
          {roleLabels[activeRole].label}
        </Badge>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* User Info */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-xs font-bold text-slate-900">{user.name}</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
              {user.role}
            </span>
          </div>
        )}

        {/* AI Copilot */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-sm hover:shadow transition-all group"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>AI Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-3 z-50 space-y-2 bg-white border border-slate-200 shadow-xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">Telemetry Notifications</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">3 New</span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl space-y-1 bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600" />}
                      {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{n.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar & logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

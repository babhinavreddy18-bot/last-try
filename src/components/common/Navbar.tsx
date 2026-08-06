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
      className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between"
      style={{
        background: 'rgba(10,15,30,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(99,102,241,0.22)',
        boxShadow: '0 1px 0 rgba(99,102,241,0.1), 0 4px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #EC4899 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.2)',
            }}
          >
            CL
          </div>
          <div className="hidden sm:block">
            <span
              className="font-black text-lg tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CargoLoop
            </span>
            <span
              className="text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(99,102,241,0.2)',
                color: '#A5B4FC',
                border: '1px solid rgba(99,102,241,0.35)',
              }}
            >
              AI Platform
            </span>
          </div>
        </div>
        <div className="h-5 w-px mx-1 hidden sm:block" style={{ background: 'rgba(99,102,241,0.3)' }} />
        <Badge variant={roleLabels[activeRole].badge} icon={roleLabels[activeRole].icon}>
          {roleLabels[activeRole].label}
        </Badge>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* User Info / Role Badge */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="text-xs font-bold text-white">{user.name}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.3)', color: '#A5B4FC' }}>
              {user.role}
            </span>
          </div>
        )}

        {/* AI Copilot */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white rounded-lg transition-all group"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            boxShadow: '0 0 20px rgba(99,102,241,0.45), 0 0 40px rgba(99,102,241,0.15)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>AI Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg transition-all relative"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#A5B4FC',
            }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl p-3 z-50 space-y-2"
              style={{
                background: 'rgba(8,12,24,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              }}
            >
              <div className="flex items-center justify-between pb-2 text-xs" style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                <span className="font-bold text-white">Telemetry Notifications</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.2)', color: '#A5B4FC' }}>3 New</span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-lg space-y-1 cursor-pointer transition-colors"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                      {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{n.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar & logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid rgba(99,102,241,0.2)' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: '2px solid rgba(99,102,241,0.5)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}
            />
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: '#64748B' }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

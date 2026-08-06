import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Truck, PackageCheck, Building2, ShieldAlert,
  MapPin, FileCheck, Sparkles, Leaf, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const SECTION_COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6'];

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      title: 'Navigation',
      items: [
        { label: 'Platform Overview', path: '/', icon: <LayoutDashboard className="w-4 h-4" />, color: '#818CF8' },
        { label: 'Driver Dashboard', path: '/dashboard/driver', icon: <Truck className="w-4 h-4" />, roleAllowed: 'driver', color: '#34D399' },
        { label: 'Shipper Hub', path: '/dashboard/shipper', icon: <PackageCheck className="w-4 h-4" />, roleAllowed: 'shipper', color: '#60A5FA' },
        { label: 'Fleet Command', path: '/dashboard/fleet', icon: <Building2 className="w-4 h-4" />, roleAllowed: 'fleet', color: '#FBBF24' },
        { label: 'Admin Telemetry', path: '/dashboard/admin', icon: <ShieldAlert className="w-4 h-4" />, roleAllowed: 'admin', color: '#F87171' },
      ],
    },
    {
      title: 'AI Intelligence',
      items: [
        { label: 'Document Scanner', path: '/dashboard/driver', icon: <FileCheck className="w-4 h-4" />, roleAllowed: 'driver', color: '#34D399' },
        { label: 'Freight Pricing Engine', path: '/dashboard/shipper', icon: <Sparkles className="w-4 h-4" />, roleAllowed: 'shipper', color: '#A78BFA' },
        { label: 'Fleet Predictor', path: '/dashboard/fleet', icon: <MapPin className="w-4 h-4" />, roleAllowed: 'fleet', color: '#FBBF24' },
        { label: 'Carbon Hub', path: '/dashboard/fleet', icon: <Leaf className="w-4 h-4" />, roleAllowed: 'fleet', color: '#34D399' },
      ],
    },
  ];

  return (
    <aside
      className="w-64 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]"
      style={{
        background: 'rgba(8,12,24,0.70)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99,102,241,0.18)',
      }}
    >
      <div className="space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            <h4
              className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2"
              style={{ color: SECTION_COLORS[idx] + 'AA' }}
            >
              {section.title}
            </h4>
            <nav className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.path;
                const isRecommended = item.roleAllowed === role;

                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={clsx(
                      'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                    )}
                    style={isActive ? {
                      background: `${item.color}22`,
                      border: `1px solid ${item.color}40`,
                      color: item.color,
                      boxShadow: `0 0 12px ${item.color}25`,
                    } : {
                      color: '#64748B',
                      border: '1px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span style={{ color: isActive ? item.color : '#475569' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isRecommended && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: item.color }} />}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Gemini status badge */}
      <div
        className="p-3 rounded-xl space-y-2"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 20px rgba(99,102,241,0.1)',
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#A5B4FC' }}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gemini 2.5 Active</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
          OCR parsing, NLP freight estimation & AI return load matching are live.
        </p>
      </div>
    </aside>
  );
};

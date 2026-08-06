import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_ANOMALIES, MOCK_TIME_SERIES } from '../mock/data';
import type { AnomalyFlag } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, ShieldCheck, Activity, Cpu, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const [anomalies, setAnomalies] = useState<AnomalyFlag[]>(MOCK_ANOMALIES);

  useEffect(() => {
    if (!location.hash) return;
    const cleanHash = location.hash.replace('#', '');
    const targetId = cleanHash.startsWith('ai-') ? cleanHash : 'ai-' + cleanHash;
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId) || document.getElementById(cleanHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-[#2563EB]', 'ring-offset-2', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#2563EB]', 'ring-offset-2');
        }, 2000);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const toggleResolve = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a))
    );
  };

  const activeAnomaliesCount = anomalies.filter((a) => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Telemetry & AI Fraud Command</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time system telemetry, active anomaly auditing & AI risk monitoring</p>
        </div>
        <Badge variant={activeAnomaliesCount > 0 ? 'red' : 'green'} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
          {activeAnomaliesCount} Unresolved AI Risk Flags
        </Badge>
      </div>

      {/* System Telemetry Metrics */}
      <div id="ai-system-telemetry" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-20">
        <StatCard
          title="Active Telemetry Nodes"
          value="50 / 50"
          change="100% Uptime"
          icon={<Cpu className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Daily Platform GMV"
          value="₹48.5 Lakhs"
          change="+22.1% vs last week"
          icon={<DollarSign className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Fraud Monitors"
          value="4 AI Guards"
          change="OCR + Pricing + GPS"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title="System Latency"
          value="42 ms"
          change="Gemini 2.5 Active"
          icon={<Activity className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* System Throughput Line Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Network Telemetry & Trip Throughput</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live Telemetry Stream</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TIME_SERIES}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
              <Tooltip formatter={(value: any) => [`${value} trips`, 'Completed Trips']} />
              <Line type="monotone" dataKey="tripCount" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Fraud & Anomaly Monitor Table */}
      <div id="ai-security-alerts" className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Fraud & Anomaly Risk Monitor</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-flagged by Gemini Security Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Severity</th>
                <th className="p-3">Flag Type</th>
                <th className="p-3">Title & Details</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {anomalies.map((anom) => (
                <tr key={anom.id} className={anom.resolved ? 'bg-slate-50/30 dark:bg-slate-800/20 opacity-60' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'}>
                  <td className="p-3">
                    <Badge
                      variant={
                        anom.severity === 'critical'
                          ? 'red'
                          : anom.severity === 'high'
                          ? 'amber'
                          : 'blue'
                      }
                    >
                      {anom.severity}
                    </Badge>
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    {anom.type.replace('_', ' ')}
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="font-bold text-slate-900 dark:text-white">{anom.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{anom.description}</p>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-mono">{anom.entityId}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{anom.timestamp}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleResolve(anom.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        anom.resolved
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      {anom.resolved ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_ANOMALIES, MOCK_TIME_SERIES } from '../mock/data';
import type { AnomalyFlag, VerificationRecord, VerificationStatusCode } from '../types';
import { getVerificationRecords, updateRecordAdminAction } from '../services/documentVerificationService';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Cpu,
  DollarSign,
  FileCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  AlertTriangle,
  AlertOctagon,
  Clock,
  HelpCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const [anomalies, setAnomalies] = useState<AnomalyFlag[]>(MOCK_ANOMALIES);
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  useEffect(() => {
    setVerificationRecords(getVerificationRecords());
  }, []);

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

  const handleAdminAction = (
    recordId: string,
    action: 'approved' | 'rejected' | 'requested_reupload' | 'manual_review'
  ) => {
    const updated = updateRecordAdminAction(recordId, action, adminNoteInput);
    if (updated) {
      setVerificationRecords(getVerificationRecords());
      if (selectedRecord && selectedRecord.id === recordId) {
        setSelectedRecord(updated);
      }
      setAdminNoteInput('');
    }
  };

  const activeAnomaliesCount = anomalies.filter((a) => !a.resolved).length;
  const pendingReviewsCount = verificationRecords.filter((r) => r.status !== 'VERIFIED').length;

  const renderStatusBadge = (status: VerificationStatusCode) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> 🟢 VERIFIED
          </span>
        );
      case 'MANUAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3 h-3" /> 🟡 MANUAL REVIEW
          </span>
        );
      case 'DATA_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
            <AlertTriangle className="w-3 h-3" /> 🟠 DATA MISMATCH
          </span>
        );
      case 'POSSIBLE_DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3 h-3" /> 🔴 POSSIBLE DUPLICATE
          </span>
        );
      case 'INVALID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3" /> 🔴 INVALID
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-400">
            <Clock className="w-3 h-3" /> ⚪ EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Telemetry & AI Fraud Command
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time telemetry, driver compliance document auditing & AI fraud control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pendingReviewsCount > 0 ? 'amber' : 'teal'} icon={<FileCheck className="w-3.5 h-3.5" />}>
            {pendingReviewsCount} Flagged Verification Audit Records
          </Badge>
          <Badge variant={activeAnomaliesCount > 0 ? 'red' : 'green'} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
            {activeAnomaliesCount} Active Risk Flags
          </Badge>
        </div>
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
          title="AI Document Audits"
          value={`${verificationRecords.length} Audited`}
          change="Gemini OCR + Cross Check"
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

      {/* ══ AI DOCUMENT VERIFICATION AUDIT & MANUAL REVIEW COMMAND CENTER ══ */}
      <div
        id="ai-document-verification-admin"
        className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-5 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                AI Document Verification Audit & Admin Review Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit extracted fields, cross-document mismatches, duplicate identifiers & execute compliance decisions
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Official verification unavailable notice automatically attached
          </span>
        </div>

        {/* Verification Audit Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">User & Vehicle ID</th>
                <th className="p-3">Doc Category</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">AI Reasoning & Duplicate Flags</th>
                <th className="p-3">Audit Time</th>
                <th className="p-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {verificationRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{rec.userName}</p>
                    <p className="text-[11px] font-mono text-slate-500">
                      User: <strong className="text-slate-700 dark:text-slate-300">{rec.userId}</strong> | Vehicle: <strong className="text-slate-700 dark:text-slate-300">{rec.vehicleId}</strong>
                    </p>
                  </td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                    {rec.documentType} ({rec.fileName.split('.').slice(-1)[0]})
                  </td>
                  <td className="p-3">{renderStatusBadge(rec.status)}</td>
                  <td className="p-3 font-black text-slate-900 dark:text-white text-sm">
                    {rec.trustScorePercent}%
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-tight">
                      {rec.aiReasoning}
                    </p>
                    {rec.duplicateInfo.isDuplicate && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                        ⚠️ Duplicate: {rec.duplicateInfo.field}
                      </span>
                    )}
                    {rec.mismatchedFields.length > 0 && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.5 rounded">
                        ⚠️ {rec.mismatchedFields.length} Mismatch(es)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">{rec.timestamp}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal / Inspection Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Document Verification Audit File: {selectedRecord.id}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  User ID: <strong className="text-slate-900 dark:text-white">{selectedRecord.userId}</strong> | Vehicle ID: <strong className="text-slate-900 dark:text-white">{selectedRecord.vehicleId}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Status & Official Verification Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Current Status:</span>
                {renderStatusBadge(selectedRecord.status)}
              </div>
              <div className="text-xs text-slate-500 italic">
                Official check status: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedRecord.officialVerification.message}</span>
              </div>
            </div>

            {/* Extracted 13 Fields Grid */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Extracted Metadata (13 Fields)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {Object.entries(selectedRecord.extractedFields).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {val || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mismatched Fields Table */}
            {selectedRecord.mismatchedFields.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-950/40 p-4 rounded-xl border border-orange-200 dark:border-orange-900 space-y-2">
                <h4 className="font-bold text-orange-900 dark:text-orange-200 text-xs">
                  Mismatched Fields ({selectedRecord.mismatchedFields.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-orange-100 dark:bg-orange-900/60 font-bold text-orange-900 dark:text-orange-200">
                      <tr>
                        <th className="p-2">Field</th>
                        <th className="p-2">Extracted Value</th>
                        <th className="p-2">Registered Value</th>
                        <th className="p-2">Sources</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecord.mismatchedFields.map((m, idx) => (
                        <tr key={idx} className="border-t border-orange-200/60 text-slate-800 dark:text-slate-200">
                          <td className="p-2 font-bold">{m.fieldName}</td>
                          <td className="p-2 font-mono text-rose-700 font-bold">{m.extractedValue}</td>
                          <td className="p-2 font-mono text-emerald-700 font-bold">{m.expectedValue}</td>
                          <td className="p-2 text-[11px]">{m.sourceA} vs {m.sourceB}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Duplicate Flag Alert */}
            {selectedRecord.duplicateInfo.isDuplicate && (
              <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                <p className="font-bold">⚠️ Duplicate Identifier Warning</p>
                <p>{selectedRecord.duplicateInfo.reason}</p>
                <p className="text-[10px] text-slate-500 italic">Account identity protected for privacy.</p>
              </div>
            )}

            {/* Admin Action Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Admin Audit Decision & Actions</h4>
              <input
                type="text"
                placeholder="Optional admin decision note..."
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleAdminAction(selectedRecord.id, 'approved')}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleAdminAction(selectedRecord.id, 'rejected')}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  onClick={() => handleAdminAction(selectedRecord.id, 'requested_reupload')}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Request Re-upload
                </button>
                <button
                  onClick={() => handleAdminAction(selectedRecord.id, 'manual_review')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Mark Manual Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <div
        id="ai-security-alerts"
        className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4 scroll-mt-20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Fraud & Anomaly Risk Monitor</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Auto-flagged by Gemini Security Engine
          </span>
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
                <tr
                  key={anom.id}
                  className={anom.resolved ? 'bg-slate-50/60 dark:bg-slate-800/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'}
                >
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
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    {anom.type.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{anom.title}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">{anom.description}</p>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{anom.entityId}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 text-xs font-medium">{anom.timestamp}</td>
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

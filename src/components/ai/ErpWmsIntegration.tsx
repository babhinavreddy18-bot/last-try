import React, { useState } from 'react';
import {
  Database, RefreshCw, ShieldCheck, Play, Radio,
  FileCode, Layers, Cpu
} from 'lucide-react';
import { Badge } from '../common/Badge';

export interface ConnectorSystem {
  id: string;
  name: string;
  category: 'ERP' | 'WMS' | 'GST/e-Waybill';
  provider: string;
  status: 'connected' | 'syncing' | 'idle' | 'error';
  lastSync: string;
  recordsSyncedToday: number;
  apiProtocol: 'REST Webhook' | 'SAP OData' | 'EDIFACT/x12' | 'GraphQL';
  logo: string;
  color: string;
}

const DEFAULT_CONNECTORS: ConnectorSystem[] = [
  {
    id: 'sap-s4hana',
    name: 'SAP S/4HANA Enterprise',
    category: 'ERP',
    provider: 'SAP SE',
    status: 'connected',
    lastSync: 'Just now (Real-time)',
    recordsSyncedToday: 1420,
    apiProtocol: 'SAP OData',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100',
    color: '#2563EB',
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite ERP',
    category: 'ERP',
    provider: 'Oracle',
    status: 'connected',
    lastSync: '2m ago',
    recordsSyncedToday: 890,
    apiProtocol: 'REST Webhook',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100',
    color: '#0D9488',
  },
  {
    id: 'manhattan-wms',
    name: 'Manhattan WMS Cloud',
    category: 'WMS',
    provider: 'Manhattan Associates',
    status: 'connected',
    lastSync: '1m ago',
    recordsSyncedToday: 3240,
    apiProtocol: 'EDIFACT/x12',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100',
    color: '#7C3AED',
  },
  {
    id: 'infor-wms',
    name: 'Infor Warehouse Management',
    category: 'WMS',
    provider: 'Infor Inc',
    status: 'idle',
    lastSync: '15m ago',
    recordsSyncedToday: 640,
    apiProtocol: 'REST Webhook',
    logo: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=100',
    color: '#D97706',
  },
  {
    id: 'gst-ewaybill',
    name: 'Govt GST e-Waybill Portal',
    category: 'GST/e-Waybill',
    provider: 'NIC Govt India',
    status: 'connected',
    lastSync: '30s ago',
    recordsSyncedToday: 512,
    apiProtocol: 'REST Webhook',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100',
    color: '#059669',
  },
  {
    id: 'tally-prime',
    name: 'Tally Prime Logistics Ledger',
    category: 'ERP',
    provider: 'Tally Solutions',
    status: 'connected',
    lastSync: '5m ago',
    recordsSyncedToday: 310,
    apiProtocol: 'GraphQL',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100',
    color: '#DC2626',
  },
];

export const ErpWmsIntegration: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorSystem[]>(DEFAULT_CONNECTORS);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorSystem>(DEFAULT_CONNECTORS[0]);
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[SYSTEM INITIALIZED] ERP & WMS Webhook Listener Active (Port 8443)',
    '[SAP S/4HANA] 14 Sales Orders pulled & converted to Dispatch Jobs',
    '[Manhattan WMS] Dock 4 Loading ASN #ASN-9902 auto-verified with CargoLoop Driver GPS',
    '[e-Waybill NIC] 12 e-Waybill Receipts auto-generated & attached to active trucks',
  ]);

  const handleRunSync = async (connectorId: string) => {
    setIsSimulatingSync(true);
    setConnectors(prev =>
      prev.map(c => (c.id === connectorId ? { ...c, status: 'syncing' } : c))
    );

    const nowTime = new Date().toLocaleTimeString();
    setSyncLogs(prev => [
      `[${nowTime}] [INITIATING SYNC] Triggered manual data exchange with ${selectedConnector.name}...`,
      ...prev,
    ]);

    await new Promise(r => setTimeout(r, 1200));

    setSyncLogs(prev => [
      `[${nowTime}] [SUCCESS] ${selectedConnector.name}: 28 Purchase Orders & Inventory Receipts synced cleanly. Zero schema errors.`,
      `[${nowTime}] [AUTOMATION] Gemini AI auto-mapped 6 custom ERP fields to CargoLoop Dispatch Schema.`,
      ...prev,
    ]);

    setConnectors(prev =>
      prev.map(c =>
        c.id === connectorId
          ? {
              ...c,
              status: 'connected',
              lastSync: 'Just now',
              recordsSyncedToday: c.recordsSyncedToday + 28,
            }
          : c
      )
    );
    setIsSimulatingSync(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden space-y-0 text-slate-900">
      {/* Top Banner Header */}
      <div className="p-6 space-y-4 border-b border-[#e2e8f0]" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white shrink-0 shadow-md">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl tracking-tight text-white">ERP & WMS Automated Data Sharing Hub</h2>
                <span className="text-[10px] font-black bg-[#2563eb] text-white border border-blue-400 px-2.5 py-0.5 rounded-full shadow-2xs">
                  Bi-Directional Sync
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5 font-medium">
                Real-time automated data pipelines between SAP, Oracle NetSuite, Manhattan WMS, Tally, & Govt e-Waybill.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleRunSync(selectedConnector.id)}
            disabled={isSimulatingSync}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isSimulatingSync ? (
              <><RefreshCw className="w-4 h-4 animate-spin text-white" /><span>Syncing Payload…</span></>
            ) : (
              <><Play className="w-4 h-4 text-white fill-white" /><span>Test Automated Data Exchange</span></>
            )}
          </button>
        </div>

        {/* Telemetry Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94a3b8' }}>Connected Systems</p>
            <p className="font-black text-white text-lg mt-0.5">6 Live Systems</p>
          </div>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94a3b8' }}>Today's Data Syncs</p>
            <p className="font-black text-white text-lg mt-0.5">
              {connectors.reduce((acc, c) => acc + c.recordsSyncedToday, 0).toLocaleString()} Records
            </p>
          </div>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94a3b8' }}>Schema AI Mapping</p>
            <p className="font-black text-white text-lg mt-0.5">100% Zero Code</p>
          </div>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#94a3b8' }}>Sync Frequency</p>
            <p className="font-black text-white text-lg mt-0.5">Real-Time Webhook</p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">

        {/* Left Column: Active ERP/WMS Connectors List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-black text-[#0f172a] text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Enterprise Systems ({connectors.length})</span>
            <span className="text-[10px] font-black text-[#2563eb] flex items-center gap-1 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              <Radio className="w-3 h-3 animate-pulse text-[#2563eb]" /> Active Listeners
            </span>
          </h3>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {connectors.map((connector) => {
              const isSelected = selectedConnector.id === connector.id;
              const categoryBadgeText = connector.category === 'GST/e-Waybill' ? 'GST' : connector.category;
              return (
                <div
                  key={connector.id}
                  onClick={() => setSelectedConnector(connector)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#eff6ff] border-[#2563eb] shadow-sm ring-2 ring-[#2563eb]/20'
                      : 'bg-white hover:bg-[#f8fafc] border-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm"
                      style={{ background: connector.color }}
                    >
                      {categoryBadgeText}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-[#0f172a] text-xs truncate">
                        {connector.name}
                      </p>
                      <p className="text-[11px] font-bold text-[#334155] truncate mt-0.5">
                        {connector.apiProtocol} • <span className="text-[#64748b] font-medium">Sync: {connector.lastSync}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge variant="blue" size="sm">
                      {connector.status === 'syncing' ? 'Syncing...' : 'Connected'}
                    </Badge>
                    <p className="text-[11px] font-black text-[#0f172a] mt-1">
                      {connector.recordsSyncedToday} Recs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Connector Details & Live Webhook Data Stream */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Connector Detail Panel */}
          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shrink-0"
                  style={{ background: selectedConnector.color }}
                >
                  {selectedConnector.category === 'GST/e-Waybill' ? 'GST' : selectedConnector.category}
                </div>
                <div>
                  <h4 className="font-black text-[#0f172a] text-base sm:text-xl">
                    {selectedConnector.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#334155] mt-1">
                    <span>Vendor: <strong className="text-[#0f172a] font-black">{selectedConnector.provider}</strong></span>
                    <span>•</span>
                    <span>Protocol:</span>
                    <span className="font-black text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {selectedConnector.apiProtocol}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRunSync(selectedConnector.id)}
                disabled={isSimulatingSync}
                className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-blue-300 text-white font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>

            {/* Configured Automated Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-[#0f172a]">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#2563eb]" />
                    Orders Sync
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[11px] text-[#334155] font-bold leading-relaxed">
                  Auto-converts SAP/NetSuite Sales Orders into Driver Cargo Jobs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-[#0f172a]">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#7c3aed]" />
                    WMS Inventory
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[11px] text-[#334155] font-bold leading-relaxed">
                  Real-time warehouse dock allocation & ASN cargo barcode verification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-[#0f172a]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    e-Waybill GST
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[11px] text-[#334155] font-bold leading-relaxed">
                  Auto-attaches Govt GST e-Waybill PDF to driver telemetry app.
                </p>
              </div>
            </div>
          </div>

          {/* Live Webhook & Data Sharing Terminal Log Stream */}
          <div
            className="p-5 rounded-2xl font-mono text-xs space-y-3 shadow-xl border"
            style={{ backgroundColor: '#000000', color: '#f8fafc', borderColor: '#27272a' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#27272a' }}>
              <span className="text-xs font-bold flex items-center gap-2" style={{ color: '#34d399' }}>
                <Cpu className="w-4 h-4 animate-pulse" style={{ color: '#34d399' }} />
                Live Webhook Data Exchange Stream
              </span>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded border"
                style={{ backgroundColor: '#064e3b', color: '#6ee7b7', borderColor: '#059669' }}
              >
                200 OK • 12ms Latency
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-[11px] leading-relaxed">
              {syncLogs.map((log, idx) => {
                const isSuccess = log.includes('SUCCESS');
                const isInitiating = log.includes('INITIATING');

                const itemStyle = isSuccess
                  ? { backgroundColor: '#052e16', color: '#4ade80', borderColor: '#14532d' }
                  : isInitiating
                  ? { backgroundColor: '#1e3a8a', color: '#93c5fd', borderColor: '#1d4ed8' }
                  : { backgroundColor: '#111827', color: '#f9fafb', borderColor: '#1f2937' };

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl font-mono font-semibold border shadow-xs transition-all"
                    style={itemStyle}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

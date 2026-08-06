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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden space-y-0">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl tracking-tight">ERP & WMS Automated Data Sharing Hub</h2>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Bi-Directional Sync
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Real-time automated data pipelines between SAP, Oracle NetSuite, Manhattan WMS, Tally, & Govt e-Waybill.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleRunSync(selectedConnector.id)}
            disabled={isSimulatingSync}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isSimulatingSync ? (
              <><RefreshCw className="w-4 h-4 animate-spin text-amber-300" /><span>Syncing Payload…</span></>
            ) : (
              <><Play className="w-4 h-4 text-emerald-400" /><span>Test Automated Data Exchange</span></>
            )}
          </button>
        </div>

        {/* Live System Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Connected Systems</p>
            <p className="font-extrabold text-white text-lg mt-0.5">6 Live Systems</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Today's Data Syncs</p>
            <p className="font-extrabold text-emerald-400 text-lg mt-0.5">
              {connectors.reduce((acc, c) => acc + c.recordsSyncedToday, 0).toLocaleString()} Records
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Schema AI Mapping</p>
            <p className="font-extrabold text-blue-300 text-lg mt-0.5">100% Zero Code</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Sync Frequency</p>
            <p className="font-extrabold text-teal-300 text-lg mt-0.5">Real-Time Webhook</p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Active ERP/WMS Connectors List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Enterprise Systems ({connectors.length})</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> Active Listeners
            </span>
          </h3>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {connectors.map((connector) => {
              const isSelected = selectedConnector.id === connector.id;
              return (
                <div
                  key={connector.id}
                  onClick={() => setSelectedConnector(connector)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-indigo-950/60 border-blue-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shrink-0 shadow-2xs"
                      style={{ background: connector.color }}
                    >
                      {connector.category}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {connector.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {connector.apiProtocol} • Sync: {connector.lastSync}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge variant={connector.status === 'syncing' ? 'amber' : 'green'} size="sm">
                      {connector.status === 'syncing' ? 'Syncing...' : 'Connected'}
                    </Badge>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">
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
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                  style={{ background: selectedConnector.color }}
                >
                  {selectedConnector.category}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedConnector.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Vendor: {selectedConnector.provider} • Protocol: <span className="font-bold text-blue-600 dark:text-indigo-400">{selectedConnector.apiProtocol}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRunSync(selectedConnector.id)}
                disabled={isSimulatingSync}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>

            {/* Configured Automated Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                    Orders Sync
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Auto-converts SAP/NetSuite Sales Orders into Driver Cargo Jobs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    WMS Inventory
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Real-time warehouse dock allocation & ASN cargo barcode verification.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    e-Waybill GST
                  </span>
                  <Badge variant="green" size="sm">Auto</Badge>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Auto-attaches Govt GST e-Waybill PDF to driver telemetry app.
                </p>
              </div>
            </div>
          </div>

          {/* Live Webhook & Data Sharing Terminal Log Stream */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Webhook Data Exchange Stream
              </span>
              <span className="text-[10px] text-slate-500">200 OK • 12ms Latency</span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-[11px] leading-relaxed">
              {syncLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded ${
                    log.includes('SUCCESS') ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' :
                    log.includes('INITIATING') ? 'bg-blue-950/40 text-blue-300 border border-blue-800/40' :
                    'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

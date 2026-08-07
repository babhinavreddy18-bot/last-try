import React, { useState } from 'react';
import { verifyDriverDocumentAI } from '../../services/geminiService';
import type { DocumentVerificationResult } from '../../types';
import { Badge } from '../common/Badge';
import { Upload, FileCheck, CheckCircle2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const DocumentScanner: React.FC = () => {
  const [docType, setDocType] = useState<'license' | 'rc' | 'insurance' | 'puc'>('license');
  const [scanning, setScanning] = useState(false);

  const [result, setResult] = useState<DocumentVerificationResult | null>({
    trustScorePercent: 98,
    confidenceBadge: 'High Confidence',
    isAuthentic: true,
    aiFlags: ['RTO Database Matched', 'Official Hologram Detected', 'Date Signature Valid'],
    expiryChecks: [
      {
        documentName: 'Commercial Heavy Driving License',
        isValid: true,
        expiryDate: '2028-11-15',
        extractedText: 'DL NO: MH-12-2020-00101 | RTO MUMBAI WEST | CLASS: TRANS/HMV | VALID TILL: 2028-11-15',
      },
    ],
  });

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileName = file ? file.name : `${docType}_uploaded_document.pdf`;

    setScanning(true);
    setResult(null);

    // Simulate 1.8s OCR scan delay
    setTimeout(async () => {
      const res = await verifyDriverDocumentAI(docType, fileName);
      setResult(res);
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">AI Document Verification Center</h3>
            <p className="text-xs text-slate-500">Gemini OCR document trust engine & expiration auditor</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          {(['license', 'rc', 'insurance', 'puc'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setDocType(t)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition-colors ${
                docType === t ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* File Uploader Dropzone */}
      <div className="space-y-3">
        <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors overflow-hidden group">
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10 shadow-[0_0_15px_#2563eb]" />
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleSimulatedUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white rounded-full shadow-2xs border border-slate-200 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Drag & Drop or <span className="text-blue-600 underline">Browse File</span>
              </p>
              <p className="text-[11px] text-slate-400">Supports PDF, PNG, JPG (License, RC, Insurance, PUC)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Results Card */}
      {scanning && (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 py-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Running Gemini OCR & Hologram Verification...</span>
        </div>
      )}

      {result && !scanning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                {result.trustScorePercent}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Document Trust Score</span>
                  <Badge variant="teal" icon={<ShieldCheck className="w-3 h-3" />}>
                    {result.confidenceBadge}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">Authenticity verified against central registry</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Valid</span>
            </div>
          </div>

          {/* Extracted Text Details */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Extracted Metadata</span>
            {result.expiryChecks.map((chk, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{chk.documentName}</span>
                  <span className="text-slate-500">Expires: <strong className="text-slate-900">{chk.expiryDate}</strong></span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 truncate">
                  {chk.extractedText}
                </p>
              </div>
            ))}
          </div>

          {/* AI Security Flags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Checks:
            </span>
            {result.aiFlags.map((flag, idx) => (
              <span key={idx} className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                ✓ {flag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { verifyDriverDocumentAI } from '../../services/geminiService';
import type { DocumentCategory, DocumentVerificationResult, VerificationStatusCode } from '../../types';
import {
  Upload,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  XCircle,
  Clock,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PROGRESS_STEPS = [
  'Uploading',
  'Reading Document',
  'Extracting Data',
  'Checking Document',
  'Comparing Records',
  'Duplicate Check',
  'Verification Result',
] as const;

export const DocumentScanner: React.FC = () => {
  const [docType, setDocType] = useState<DocumentCategory>('license');
  const [scanning, setScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [result, setResult] = useState<DocumentVerificationResult | null>({
    trustScorePercent: 98,
    confidenceBadge: 'High Confidence',
    status: 'VERIFIED',
    isAuthentic: true,
    aiFlags: [
      'Document Readability Pass',
      'Hologram & Seal Intact',
      'Cross-Document Consistency Verified',
      'Unique Identifier Verified',
    ],
    expiryChecks: [
      {
        documentName: 'Commercial Heavy Driving License',
        isValid: true,
        expiryDate: '2028-11-15',
        extractedText: 'REG NO: DL-MH12202000101 | HOLDER: Rajesh Kumar | EXP: 2028-11-15',
      },
    ],
    record: {
      id: 'ver-rec-demo',
      userId: 'drv-101',
      userName: 'Rajesh Kumar',
      vehicleId: 'trk-201',
      documentType: 'license',
      fileName: 'driving_license_2025.pdf',
      extractedFields: {
        fullName: 'Rajesh Kumar',
        licenseNumber: 'DL-MH12202000101',
        vehicleRegistrationNumber: 'MH-12-CL-3012',
        chassisNumber: 'MA3EWB1S000129481',
        engineNumber: 'E413CD983201',
        vehicleMakeModel: 'Tata Prima 4928.S',
        insurancePolicyNumber: 'INS-2025-884920',
        insuranceValidity: '2026-12-31',
        pucCertificateNumber: 'PUC-MH12-99382',
        pucValidity: '2026-09-30',
        issueDate: '2020-11-15',
        expiryDate: '2028-11-15',
        ownerDetails: 'Rajesh Kumar - Express Highways India',
      },
      qualityCheck: {
        isReadable: true,
        isComplete: true,
        isTampered: false,
        missingFields: [],
        docTypeMatch: true,
      },
      mismatchedFields: [],
      duplicateInfo: { isDuplicate: false },
      trustScorePercent: 98,
      aiReasoning: 'Hologram, serial code, and cross-document match verified successfully.',
      status: 'VERIFIED',
      officialVerification: {
        connected: false,
        message: 'Official verification unavailable — manual verification required.',
      },
      timestamp: 'Just now',
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileName = file ? file.name : `${docType}_uploaded_document.pdf`;

    setScanning(true);
    setResult(null);
    setCurrentStepIndex(0);

    // Read base64 file data if available
    let base64Data: string | undefined = undefined;
    if (file) {
      try {
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.warn('File read error:', err);
      }
    }

    // Animate progress steps (0 to 6)
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROGRESS_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 350);

    setTimeout(async () => {
      clearInterval(stepInterval);
      setCurrentStepIndex(PROGRESS_STEPS.length - 1);
      const res = await verifyDriverDocumentAI(docType, fileName, base64Data);
      setResult(res);
      setScanning(false);
    }, 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const renderStatusBadge = (status: VerificationStatusCode) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 VERIFIED
          </span>
        );
      case 'MANUAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5" /> 🟡 MANUAL REVIEW REQUIRED
          </span>
        );
      case 'DATA_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
            <AlertTriangle className="w-3.5 h-3.5" /> 🟠 DATA MISMATCH
          </span>
        );
      case 'POSSIBLE_DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5" /> 🔴 POSSIBLE DUPLICATE
          </span>
        );
      case 'INVALID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5" /> 🔴 INVALID DOCUMENT
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-400">
            <Clock className="w-3.5 h-3.5" /> ⚪ EXPIRED DOCUMENT
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Document Verification Center</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gemini OCR document trust engine, cross-document auditor & duplicate detector
            </p>
          </div>
        </div>

        {/* Document Type Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
          {(
            [
              { id: 'license', label: 'Driving Licence' },
              { id: 'rc', label: 'Vehicle RC' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'puc', label: 'PUC Certificate' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                docType === tab.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Dropzone */}
      <div className="space-y-3">
        <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors overflow-hidden group">
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10 shadow-[0_0_15px_#2563eb]" />
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={scanning}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-2xs border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Drag & Drop or <span className="text-blue-600 dark:text-blue-400 underline">Browse File</span>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Upload {docType.toUpperCase()} (Supports PDF, PNG, JPG up to 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Flow Stepper during Scan */}
      {scanning && (
        <div className="bg-blue-50/70 dark:bg-blue-950/40 rounded-xl p-4 border border-blue-100 dark:border-blue-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>AI Verification Pipeline Active: {PROGRESS_STEPS[currentStepIndex]}</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
              Step {currentStepIndex + 1} / {PROGRESS_STEPS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-200/60 dark:bg-blue-900/60 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-blue-600 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Badges Row */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {PROGRESS_STEPS.map((step, idx) => (
              <div
                key={step}
                className={`text-[9px] text-center font-semibold py-1 rounded transition-colors ${
                  idx <= currentStepIndex
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Results Display */}
      {result && !scanning && result.record && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Header Summary Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl font-black text-xl shadow-2xs ${
                  result.status === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : result.status === 'DATA_MISMATCH'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300'
                    : result.status === 'POSSIBLE_DUPLICATE' || result.status === 'INVALID'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {result.trustScorePercent}%
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    Verification Confidence
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({result.confidenceBadge})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI Reason: <span className="font-medium text-slate-700 dark:text-slate-300">{result.record.aiReasoning}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {renderStatusBadge(result.status)}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Audited: {result.record.timestamp}
              </span>
            </div>
          </div>

          {/* User Warning Banner if verification failed */}
          {result.status !== 'VERIFIED' && (
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                    ⚠️ Document verification failed
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    Some information does not match the submitted vehicle/document records. Please provide the correct information and upload a valid document.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Official Verification Availability Alert */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-medium">{result.record.officialVerification.message}</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
              AI / OCR + Cross-Check Active
            </span>
          </div>

          {/* Cross-Document Mismatch Details Card */}
          {result.record.mismatchedFields.length > 0 && (
            <div className="bg-orange-50/60 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-200 dark:border-orange-900 space-y-3">
              <div className="flex items-center gap-2 text-orange-900 dark:text-orange-200 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>DATA MISMATCH DETECTED ({result.record.mismatchedFields.length} Inconsistent Fields)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-orange-100/70 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200 font-bold">
                    <tr>
                      <th className="p-2">Field Name</th>
                      <th className="p-2">Extracted Document Value</th>
                      <th className="p-2">Registered System Value</th>
                      <th className="p-2">Source Records</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-200/60 dark:divide-orange-900/40 text-slate-800 dark:text-slate-200">
                    {result.record.mismatchedFields.map((m, i) => (
                      <tr key={i} className="hover:bg-orange-100/40 dark:hover:bg-orange-900/20">
                        <td className="p-2 font-bold text-orange-950 dark:text-orange-100">{m.fieldName}</td>
                        <td className="p-2 font-mono font-semibold text-rose-700 dark:text-rose-400">{m.extractedValue}</td>
                        <td className="p-2 font-mono font-semibold text-emerald-700 dark:text-emerald-400">{m.expectedValue}</td>
                        <td className="p-2 text-[11px] text-slate-500">
                          {m.sourceA} ↔ {m.sourceB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Duplicate Document Alert Card */}
          {result.record.duplicateInfo.isDuplicate && (
            <div className="bg-rose-50/80 dark:bg-rose-950/40 p-4 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>⚠️ POSSIBLE DUPLICATE DOCUMENT DETECTED</span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">
                Reason: {result.record.duplicateInfo.reason}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                🔒 Security Note: For privacy reasons, the account details associated with the pre-existing duplicate registration are protected and not displayed.
              </p>
            </div>
          )}

          {/* Extracted 13-Field Metadata Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Extracted Document Metadata (13 Key Fields)</span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Gemini OCR Auto-Parsed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  { label: 'Full Name', val: result.record.extractedFields.fullName },
                  { label: 'Licence Number', val: result.record.extractedFields.licenseNumber },
                  { label: 'Vehicle Registration #', val: result.record.extractedFields.vehicleRegistrationNumber },
                  { label: 'Chassis Number', val: result.record.extractedFields.chassisNumber },
                  { label: 'Engine Number', val: result.record.extractedFields.engineNumber },
                  { label: 'Vehicle Make / Model', val: result.record.extractedFields.vehicleMakeModel },
                  { label: 'Insurance Policy #', val: result.record.extractedFields.insurancePolicyNumber },
                  { label: 'Insurance Validity', val: result.record.extractedFields.insuranceValidity },
                  { label: 'PUC Certificate #', val: result.record.extractedFields.pucCertificateNumber },
                  { label: 'PUC Validity', val: result.record.extractedFields.pucValidity },
                  { label: 'Issue Date', val: result.record.extractedFields.issueDate },
                  { label: 'Expiry Date', val: result.record.extractedFields.expiryDate },
                ] as const
              ).map((field, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between group hover:border-blue-300 transition-colors"
                >
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {field.val || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(field.val, field.label)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title={`Copy ${field.label}`}
                  >
                    {copiedField === field.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Owner / Vehicle details footer block */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                Owner & Vehicle Registration Details
              </span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {result.record.extractedFields.ownerDetails}
              </span>
            </div>
          </div>

          {/* AI Checks & Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Security Audit Passed:
            </span>
            {result.aiFlags.map((flag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700"
              >
                {flag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

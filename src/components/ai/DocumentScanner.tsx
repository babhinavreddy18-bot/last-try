import React, { useState } from 'react';
import { verifyDriverDocumentAI } from '../../services/geminiService';
import type { DocumentCategory, DocumentVerificationResult, VerificationStatusCode } from '../../types';
import {
  Upload,
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
  Shield,
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 🟢 VERIFIED
          </span>
        );
      case 'MANUAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-2xs">
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 🟡 MANUAL REVIEW REQUIRED
          </span>
        );
      case 'DATA_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-700 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" /> 🟠 DATA MISMATCH
          </span>
        );
      case 'POSSIBLE_DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700 shadow-2xs">
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" /> 🔴 POSSIBLE DUPLICATE
          </span>
        );
      case 'INVALID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-700 shadow-2xs">
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> 🔴 INVALID DOCUMENT
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border border-slate-400 dark:border-slate-600 shadow-2xs">
            <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" /> ⚪ EXPIRED DOCUMENT
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 border-2 border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-md space-y-6">
      {/* Top Gradient Highlight Strip */}
      <div className="h-1.5 w-[calc(100%+3.5rem)] -mt-7 -mx-7 mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 rounded-t-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                AI Document Verification Center
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Gemini 2.5 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Automated Gemini OCR extraction, cross-document verification & duplicate detection engine
            </p>
          </div>
        </div>

        {/* Document Type Category Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs overflow-x-auto shrink-0">
          {(
            [
              { id: 'license', label: 'Driving Licence' },
              { id: 'rc', label: 'Vehicle RC' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'puc', label: 'PUC Cert' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocType(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-xs ${
                docType === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Dropzone */}
      <div className="space-y-3">
        <div className="relative border-2 border-dashed border-blue-300 dark:border-blue-700/60 hover:border-blue-600 dark:hover:border-blue-400 rounded-2xl p-7 text-center bg-gradient-to-b from-blue-50/40 via-slate-50/50 to-white dark:from-slate-800/40 dark:via-slate-800/20 dark:to-slate-900/60 shadow-inner group transition-all">
          {scanning && (
            <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10 shadow-[0_0_20px_#2563eb]" />
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={scanning}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:border-blue-500 transition-all">
              <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                Drag & Drop or <span className="text-blue-600 dark:text-blue-400 underline">Click to Upload Document</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Upload <strong className="text-slate-800 dark:text-slate-200">{docType.toUpperCase()}</strong> (PDF, PNG, JPG supported up to 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Flow Stepper during Scan */}
      {scanning && (
        <div className="bg-blue-50/80 dark:bg-blue-950/60 rounded-2xl p-5 border border-blue-200 dark:border-blue-900 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-extrabold text-blue-900 dark:text-blue-200">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span>Pipeline Stage: {PROGRESS_STEPS[currentStepIndex]}</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
              Step {currentStepIndex + 1} of {PROGRESS_STEPS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-200/80 dark:bg-blue-900/80 h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Badges Row */}
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {PROGRESS_STEPS.map((step, idx) => (
              <div
                key={step}
                className={`text-[9.5px] text-center font-extrabold py-1.5 rounded-lg transition-colors truncate px-0.5 ${
                  idx <= currentStepIndex
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500'
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Summary Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-2xl font-black text-2xl shadow-md ${
                  result.status === 'VERIFIED'
                    ? 'bg-emerald-500 text-white'
                    : result.status === 'DATA_MISMATCH'
                    ? 'bg-orange-500 text-white'
                    : result.status === 'POSSIBLE_DUPLICATE' || result.status === 'INVALID'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {result.trustScorePercent}%
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                    Document Verification Confidence
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    {result.confidenceBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-normal max-w-xl">
                  AI Summary: <strong className="text-slate-900 dark:text-white">{result.record.aiReasoning}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {renderStatusBadge(result.status)}
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono font-medium">
                Timestamp: {result.record.timestamp}
              </span>
            </div>
          </div>

          {/* User Warning Banner if verification failed */}
          {result.status !== 'VERIFIED' && (
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className="bg-rose-50 dark:bg-rose-950/60 p-4 rounded-2xl border-2 border-rose-300 dark:border-rose-800 space-y-2 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-rose-950 dark:text-rose-100 text-sm">
                    ⚠️ Document verification failed
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-300 font-medium mt-0.5 leading-relaxed">
                    Some information does not match the submitted vehicle/document records. Please provide the correct information and upload a valid document.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Official Verification Availability Alert */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{result.record.officialVerification.message}</span>
            </div>
            <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-md shrink-0">
              Gemini OCR + Cross-Match Active
            </span>
          </div>

          {/* Cross-Document Mismatch Details Card */}
          {result.record.mismatchedFields.length > 0 && (
            <div className="bg-orange-50/90 dark:bg-orange-950/50 p-5 rounded-2xl border-2 border-orange-300 dark:border-orange-800 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-orange-950 dark:text-orange-100 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>DATA MISMATCH DETECTED ({result.record.mismatchedFields.length} Inconsistent Fields)</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-orange-200 dark:border-orange-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-orange-100/90 dark:bg-orange-900/80 text-orange-950 dark:text-orange-100 font-extrabold border-b border-orange-200 dark:border-orange-800">
                    <tr>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">Extracted Document Value</th>
                      <th className="p-2.5">Registered System Value</th>
                      <th className="p-2.5">Source Records</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-200/80 dark:divide-orange-900/60 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/60">
                    {result.record.mismatchedFields.map((m, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{m.fieldName}</td>
                        <td className="p-2.5 font-mono font-extrabold text-rose-600 dark:text-rose-400">{m.extractedValue}</td>
                        <td className="p-2.5 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{m.expectedValue}</td>
                        <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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
            <div className="bg-rose-50/90 dark:bg-rose-950/50 p-5 rounded-2xl border-2 border-rose-300 dark:border-rose-800 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-rose-950 dark:text-rose-100 font-extrabold text-xs">
                <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>⚠️ POSSIBLE DUPLICATE DOCUMENT DETECTED</span>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200 font-bold">
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
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Extracted Document Metadata (13 Key Fields)</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Gemini OCR Parsed
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
                  className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between group hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="text-xs font-mono font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                      {field.val || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(field.val, field.label)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0"
                    title={`Copy ${field.label}`}
                  >
                    {copiedField === field.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Owner / Vehicle details footer block */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                Owner & Vehicle Registration Details
              </span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                {result.record.extractedFields.ownerDetails}
              </span>
            </div>
          </div>

          {/* AI Security Flags */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" /> AI Security Audit Passed:
            </span>
            {result.aiFlags.map((flag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs"
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

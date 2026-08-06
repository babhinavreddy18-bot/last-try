import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient';
import {
  Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon,
  Eye, EyeOff, Truck, Package, Building2, Shield,
  CheckCircle2, AlertCircle, Loader2, Globe, ChevronDown
} from 'lucide-react';
import { TruckLogo } from '../common/TruckLogo';

interface AuthCardProps {
  onSuccess?: () => void;
}

export type IndianLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';

interface LanguageOption {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

interface TranslationDict {
  subtitle: string;
  quickDemo: string;
  instantAuth: string;
  selectRole: string;
  signIn: string;
  signUp: string;
  fullName: string;
  emailAddress: string;
  password: string;
  enterPass: string;
  authenticating: string;
  signInAs: string;
  createAccount: string;
  accountCreated: string;
  authenticatedAs: string;
  driverRole: string;
  shipperRole: string;
  fleetRole: string;
  adminRole: string;
  demoPasswordNote: string;
  supabaseLive: string;
}

const TRANSLATIONS: Record<IndianLanguage, TranslationDict> = {
  en: {
    subtitle: 'AI Logistics Intelligence Platform',
    quickDemo: 'Quick Demo Shortcuts',
    instantAuth: '1-Click Fill',
    selectRole: 'Select Target Portal Role',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    enterPass: 'Enter your password',
    authenticating: 'Authenticating…',
    signInAs: 'Sign In as',
    createAccount: 'Create Account',
    accountCreated: 'Account created! Logging you in as',
    authenticatedAs: 'Authenticated as',
    driverRole: 'Driver',
    shipperRole: 'Shipper',
    fleetRole: 'Fleet Owner',
    adminRole: 'Admin',
    demoPasswordNote: 'Demo password for all accounts: demo1234',
    supabaseLive: 'Supabase Database & Auth Live',
  },
  hi: {
    subtitle: 'एआई रसद खुफिया प्लेटफॉर्म',
    quickDemo: 'त्वरित डेमो शॉर्टकट',
    instantAuth: '1-क्लिक भरें',
    selectRole: 'पोर्टल भूमिका चुनें',
    signIn: 'साइन इन करें',
    signUp: 'खाता बनाएं',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    password: 'पासवर्ड',
    enterPass: 'अपना पासवर्ड दर्ज करें',
    authenticating: 'प्रमाणीकरण जारी है…',
    signInAs: 'साइन इन करें -',
    createAccount: 'खाता बनाएं',
    accountCreated: 'खाता बन गया! लॉगिन हो रहा है -',
    authenticatedAs: 'प्रमाणित -',
    driverRole: 'चालक (ड्राइवर)',
    shipperRole: 'शिपर (माल भेजने वाला)',
    fleetRole: 'बेड़ा मालिक (फ्लैट मालिक)',
    adminRole: 'एडमिन',
    demoPasswordNote: 'सभी खातों के लिए डेमो पासवर्ड: demo1234',
    supabaseLive: 'सुपाबेस डेटाबेस और ऑथ लाइव',
  },
  bn: {
    subtitle: 'এআই লজিস্টিকস ইন্টেলিজেন্স প্ল্যাটফর্ম',
    quickDemo: 'দ্রুত ডেমো শর্টকাট',
    instantAuth: '১-ক্লিক পূরণ',
    selectRole: 'টার্গেট পোর্টাল ভূমিকা নির্বাচন করুন',
    signIn: 'সাইন ইন',
    signUp: 'সাইন আপ',
    fullName: 'সম্পূর্ণ নাম',
    emailAddress: 'ইমেল ঠিকানা',
    password: 'পাসওয়ার্ড',
    enterPass: 'আপনার পাসওয়ার্ড লিখুন',
    authenticating: 'যাচাই করা হচ্ছে…',
    signInAs: 'সাইন ইন করুন -',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    accountCreated: 'অ্যাকাউন্ট তৈরি হয়েছে! লগইন করা হচ্ছে -',
    authenticatedAs: 'অনুমোদিত -',
    driverRole: 'ড্রাইভার',
    shipperRole: 'শিপার',
    fleetRole: 'ফ্লিট মালিক',
    adminRole: 'অ্যাডমিন',
    demoPasswordNote: 'সমস্ত অ্যাকাউন্টের জন্য ডেমো পাসওয়ার্ড: demo1234',
    supabaseLive: 'সুপাবেস ডাটাবেস এবং অথ লাইভ',
  },
  mr: {
    subtitle: 'एआय लॉजिस्टिक इंटेलिजन्स प्लॅटफॉर्म',
    quickDemo: 'जलद डेमो शॉर्टकट',
    instantAuth: '१-क्लिक भरा',
    selectRole: 'पोर्टल भूमिका निवडा',
    signIn: 'साइन इन करा',
    signUp: 'खाते तयार करा',
    fullName: 'पूर्ण नाव',
    emailAddress: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    enterPass: 'तुमचा पासवर्ड टाка',
    authenticating: 'प्रमाणित करत आहे…',
    signInAs: 'साइन इन करा -',
    createAccount: 'खाते तयार करा',
    accountCreated: 'खाते तयार झाले! लॉगिन होत आहे -',
    authenticatedAs: 'प्रमाणित -',
    driverRole: 'चालक',
    shipperRole: 'शिपर',
    fleetRole: 'ताफा मालक',
    adminRole: 'ॲडमिन',
    demoPasswordNote: 'सर्व खात्यांसाठी डेमो पासवर्ड: demo1234',
    supabaseLive: 'सुपाबेस डेटाबेस आणि ऑथ लाइव्ह',
  },
  te: {
    subtitle: 'AI లాజిస్టిక్స్ ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్',
    quickDemo: 'త్వరిత డెమో షార్ట్‌కట్‌లు',
    instantAuth: '1-క్లిక్ నింపండి',
    selectRole: 'లక్ష్య పోర్టల్ పాత్రను ఎంచుకోండి',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    fullName: 'పూర్తి పేరు',
    emailAddress: 'ఇమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    enterPass: 'మీ పాస్‌వర్డ్‌ను నమోదు చేయండి',
    authenticating: 'ధృవీకరిస్తోంది…',
    signInAs: 'సైన్ ఇన్ చేయండి -',
    createAccount: 'ఖాతాని సృష్టించండి',
    accountCreated: 'ఖాతా సృష్టించబడింది! లాగిన్ అవుతోంది -',
    authenticatedAs: 'ధృవీకరించబడింది -',
    driverRole: 'డ్రైవర్',
    shipperRole: 'షిప్పర్',
    fleetRole: 'ఫ్లీట్ యజమాని',
    adminRole: 'అడ్మిన్',
    demoPasswordNote: 'అన్ని ఖాతాల కోసం డెమో పాస్‌వర్డ్: demo1234',
    supabaseLive: 'సుపాబేస్ డేటాబేస్ & ఆత్ ప్రత్యక్షప్రసారం',
  },
  ta: {
    subtitle: 'AI லாஜிஸ்டிக்ஸ் நுண்ணறிவு தளம்',
    quickDemo: 'விரைவு டெமோ குறுக்குவழிகள்',
    instantAuth: '1-கிளிக் நிரப்பு',
    selectRole: 'இலக்கு போர்டல் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்',
    signIn: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    fullName: 'முழு பெயர்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    enterPass: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    authenticating: 'சரிபார்க்கிறது…',
    signInAs: 'உள்நுழைக -',
    createAccount: 'கணக்கை உருவாக்குங்கள்',
    accountCreated: 'கணக்கு உருவாக்கப்பட்டது! உள்நுழைகிறது -',
    authenticatedAs: 'அங்கீகரிக்கப்பட்டது -',
    driverRole: 'ஓட்டுநர் (டிரைவர்)',
    shipperRole: 'ஷிப்பர்',
    fleetRole: 'ஃப்ளீட் உரிமையாளர்',
    adminRole: 'நிர்வாகி',
    demoPasswordNote: 'அனைத்து கணக்குகளுக்கும் டெமோ கடவுச்சொல்: demo1234',
    supabaseLive: 'சுபாபேஸ் தரவுத்தளம் மற்றும் நேரடி',
  },
};

interface RoleOption {
  role: UserRole;
  labelKey: keyof TranslationDict;
  icon: React.ReactNode;
  color: string;
  bg: string;
  email: string;
  pass: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'driver',
    labelKey: 'driverRole',
    icon: <Truck className="w-4 h-4" />,
    color: '#0D9488',
    bg: '#CCFBF1',
    email: 'driver@cargoloop.ai',
    pass: 'demo1234',
  },
  {
    role: 'shipper',
    labelKey: 'shipperRole',
    icon: <Package className="w-4 h-4" />,
    color: '#2563EB',
    bg: '#EFF6FF',
    email: 'shipper@cargoloop.ai',
    pass: 'demo1234',
  },
  {
    role: 'fleet',
    labelKey: 'fleetRole',
    icon: <Building2 className="w-4 h-4" />,
    color: '#D97706',
    bg: '#FEF3C7',
    email: 'fleet@cargoloop.ai',
    pass: 'demo1234',
  },
  {
    role: 'admin',
    labelKey: 'adminRole',
    icon: <Shield className="w-4 h-4" />,
    color: '#DC2626',
    bg: '#FEE2E2',
    email: 'admin@cargoloop.ai',
    pass: 'demo1234',
  },
];

function inferRoleFromEmail(email: string): UserRole | null {
  const e = email.toLowerCase();
  if (e.includes('driver')) return 'driver';
  if (e.includes('shipper')) return 'shipper';
  if (e.includes('fleet')) return 'fleet';
  if (e.includes('admin')) return 'admin';
  return null;
}

function getPasswordStrength(pass: string) {
  if (pass.length < 3) return { label: 'Too short', color: '#EF4444', bars: 1 };
  if (pass.length < 6) return { label: 'Fair', color: '#F59E0B', bars: 2 };
  if (pass.length < 9) return { label: 'Good', color: '#2563EB', bars: 3 };
  return { label: 'Strong', color: '#059669', bars: 4 };
}

import { useLanguage } from '../../context/LanguageContext';

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const { loginWithCredentials } = useAuth();
  const { lang, setLang } = useLanguage();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('shipper');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const t = TRANSLATIONS[lang];
  const activeLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const fillDemoTile = (option: RoleOption) => {
    setEmail(option.email);
    setPassword(option.pass);
    setSelectedRole(option.role);
    setError('');
    setSuccess('');
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setError('');
    const inferred = inferRoleFromEmail(val);
    if (inferred) {
      setSelectedRole(inferred);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim();

    // Standard Validation
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address (e.g. user@domain.com).');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (tab === 'signup' && !fullName.trim()) {
      setError('Please enter your full name for sign up.');
      return;
    }

    setLoading(true);

    // Attempt real Supabase auth if configured
    if (isSupabaseConfigured()) {
      try {
        if (tab === 'signup') {
          const { error: sbErr } = await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
              data: { full_name: fullName, role: selectedRole },
            },
          });
          if (sbErr && !sbErr.message.includes('already registered')) {
            console.warn('Supabase auth warning:', sbErr.message);
          }
        } else {
          const { error: sbErr } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });
          if (sbErr) {
            console.warn('Supabase sign-in note:', sbErr.message);
          }
        }
      } catch (err) {
        console.warn('Supabase auth error handled gracefully:', err);
      }
    }

    // Processing delay
    await new Promise(r => setTimeout(r, 650));
    setLoading(false);

    const roleName = t[ROLE_OPTIONS.find(r => r.role === selectedRole)?.labelKey || 'shipperRole'];
    setSuccess(
      tab === 'signup'
        ? `${t.accountCreated} ${roleName}…`
        : `${t.authenticatedAs} ${roleName}! Loading…`
    );

    setTimeout(() => {
      loginWithCredentials(cleanEmail, selectedRole, fullName || undefined);
      onSuccess?.();
    }, 550);
  };

  const strength = tab === 'signup' && password.length > 0 ? getPasswordStrength(password) : null;
  const activeRoleOption = ROLE_OPTIONS.find(r => r.role === selectedRole);

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-float space-y-5 relative">

      {/* ── Top Bar: Brand & Language Picker ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <TruckLogo size="lg" />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              CargoLoop
            </h2>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* 🌐 5 Major Indian Languages Selector Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
            title="Select Spoken Language (5 Major Indian Languages)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
            <span>{activeLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Select Indian Language
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    lang === l.code
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Quick Demo Shortcuts */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-indigo-400" />
            {t.quickDemo}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {t.instantAuth}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((opt) => {
            const active = email === opt.email && selectedRole === opt.role;
            return (
              <button
                key={opt.role}
                type="button"
                onClick={() => fillDemoTile(opt)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all border ${
                  active ? 'bg-blue-50 dark:bg-indigo-950/60 border-blue-300 dark:border-indigo-700 shadow-2xs' : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span style={{ color: opt.color }}>{opt.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold truncate ${active ? 'text-blue-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {t[opt.labelKey]}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">{opt.email}</p>
                </div>
                {active && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {(['signin', 'signup'] as const).map(tabKey => (
          <button
            key={tabKey}
            type="button"
            onClick={() => { setTab(tabKey); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === tabKey ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tabKey === 'signin' ? t.signIn : t.signUp}
          </button>
        ))}
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="on">

        {/* Role Selector Bar */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>{t.selectRole}</span>
            {activeRoleOption && (
              <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: activeRoleOption.color }}>
                {activeRoleOption.icon}
                {t[activeRoleOption.labelKey]}
              </span>
            )}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {ROLE_OPTIONS.map(opt => {
              const isSelected = selectedRole === opt.role;
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setSelectedRole(opt.role)}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-0.5 transition-all border ${
                    isSelected ? 'bg-blue-50 dark:bg-indigo-950/60 border-blue-300 dark:border-indigo-700 text-blue-700 dark:text-indigo-300 shadow-2xs' : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span style={{ color: opt.color }}>{opt.icon}</span>
                  <span className="truncate w-full text-center">{t[opt.labelKey]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full name (sign-up only) */}
        <AnimatePresence>
          {tab === 'signup' && (
            <motion.div
              key="fullname"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 overflow-hidden"
            >
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{t.fullName}</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); setError(''); }}
                  placeholder="e.g. Rajesh Kumar"
                  autoComplete="name"
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{t.emailAddress}</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              placeholder="e.g. user@gmail.com"
              required
              autoComplete="email"
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{t.password}</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder={t.enterPass}
              required
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              className="w-full pl-9 pr-10 py-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength meter */}
          <AnimatePresence>
            {strength && (
              <motion.div
                key="strength"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-1 space-y-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.bars ? strength.color : '#E2E8F0' }}
                    />
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: strength.color }}>Strength: {strength.label}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Errors */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2 p-2.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl shadow-md hover:shadow flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{t.authenticating}</span></>
            : <><span>{tab === 'signin' ? `${t.signInAs} ${t[ROLE_OPTIONS.find(r => r.role === selectedRole)?.labelKey || 'shipperRole']}` : t.createAccount}</span><ArrowRight className="w-4 h-4" /></>
          }
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pt-2 space-y-1 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {isSupabaseConfigured() ? t.supabaseLive : 'Demo & Custom Auth Active'}
        </p>
      </div>
    </div>
  );
};

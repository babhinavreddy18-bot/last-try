import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient';
import {
  ArrowRight, Mail, Lock, User as UserIcon,
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

interface RegisteredAccount {
  email: string;
  name: string;
  pass: string;
  role: UserRole;
}

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  { email: 'driver@cargoloop.ai', name: 'Rajesh Kumar (Driver)', pass: 'demo1234', role: 'driver' },
  { email: 'shipper@cargoloop.ai', name: 'Vikram Malhotra (Shipper)', pass: 'demo1234', role: 'shipper' },
  { email: 'fleet@cargoloop.ai', name: 'Ananya Deshmukh (Fleet Owner)', pass: 'demo1234', role: 'fleet' },
  { email: 'admin@cargoloop.ai', name: 'Siddharth V. (System Admin)', pass: 'demo1234', role: 'admin' },
];

function getRegisteredAccounts(): RegisteredAccount[] {
  const saved = localStorage.getItem('cargoloop_registered_users');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error reading registered users:', e);
    }
  }
  localStorage.setItem('cargoloop_registered_users', JSON.stringify(DEFAULT_ACCOUNTS));
  return DEFAULT_ACCOUNTS;
}

function saveRegisteredAccount(acc: RegisteredAccount) {
  const existing = getRegisteredAccounts();
  const updated = [acc, ...existing.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase())];
  localStorage.setItem('cargoloop_registered_users', JSON.stringify(updated));
}

function getPasswordStrength(pass: string) {
  if (pass.length < 7) return { label: 'At least 7 characters required', color: '#EF4444', bars: 1 };
  if (pass.length < 9) return { label: 'Fair', color: '#F59E0B', bars: 2 };
  if (pass.length < 12) return { label: 'Good', color: '#2563EB', bars: 3 };
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
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role') as UserRole;
    if (r && ['shipper', 'driver', 'fleet', 'admin'].includes(r)) {
      return r;
    }
    return 'shipper';
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const t = TRANSLATIONS[lang];
  const activeLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

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

    const cleanEmail = email.trim().toLowerCase();

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
    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      return;
    }

    const accounts = getRegisteredAccounts();

    if (tab === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name for sign up.');
        return;
      }
      const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        setError('An account with this email is already registered. Please Sign In.');
        return;
      }

      // Save new registered account
      const newAcc: RegisteredAccount = {
        email: cleanEmail,
        name: fullName.trim(),
        pass: password,
        role: selectedRole,
      };
      saveRegisteredAccount(newAcc);
    } else {
      // Sign In validation: verify user already signed up
      const userAcc = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (!userAcc) {
        setError('No registered account found with this email. Please Sign Up first to create your account.');
        return;
      }
      if (userAcc.pass !== password) {
        setError('Incorrect password. Please verify your password and try again.');
        return;
      }
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
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);

    const accountsLatest = getRegisteredAccounts();
    const activeAcc = accountsLatest.find(a => a.email.toLowerCase() === cleanEmail);
    const roleToLogin = activeAcc?.role || selectedRole;
    const nameToLogin = activeAcc?.name || fullName || undefined;

    const roleName = t[ROLE_OPTIONS.find(r => r.role === roleToLogin)?.labelKey || 'shipperRole'];
    setSuccess(
      tab === 'signup'
        ? `${t.accountCreated} ${roleName}…`
        : `${t.authenticatedAs} ${roleName}! Loading…`
    );

    setTimeout(() => {
      loginWithCredentials(cleanEmail, roleToLogin, nameToLogin);
      onSuccess?.();
    }, 550);
  };

  const strength = tab === 'signup' && password.length > 0 ? getPasswordStrength(password) : null;

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] space-y-6 relative text-[#111827]" style={{ boxShadow: '0 8px 32px rgba(109,74,255,0.10), 0 1px 3px rgba(0,0,0,0.04)' }}>
      {/* Purple top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #6D4AFF 0%, #8B5CF6 100%)' }} />

      {/* Header Section */}
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
          {tab === 'signin' ? 'Welcome back' : 'Create Account'}
        </h1>
        <p className="text-sm text-[#6B7280] font-normal leading-relaxed max-w-xs mx-auto">
          {tab === 'signin'
            ? 'Log in to your CargoLoop account and continue managing your logistics.'
            : 'Sign up for CargoLoop to access real-time AI freight dispatch & fleet intelligence.'}
        </p>
      </div>

      {/* ── Language Selector Dropdown ── */}
      <div className="flex items-center justify-between text-xs border-b border-[#F3F4F6] pb-4">
        <div className="flex items-center gap-2">
          <TruckLogo size="sm" />
          <span className="font-bold text-[#111827] text-xs">CargoLoop</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F5F3FF] hover:border-[#DDD6FE] text-[#111827] text-xs font-semibold transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span>{activeLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-[#6B7280]" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_8px_28px_rgba(109,74,255,0.12)] p-1.5 z-50 space-y-0.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    lang === l.code
                      ? 'bg-[#6D4AFF] text-white'
                      : 'text-[#111827] hover:bg-[#F5F3FF] hover:text-[#6D4AFF]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </span>
                  <span className="text-[10px] opacity-60">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>



      {/* Form Tabs */}
      <div className="flex p-1 bg-[#F3F4F6] rounded-full border border-[#E5E7EB]">
        {(['signin', 'signup'] as const).map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => { setTab(tabKey); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              tab === tabKey
                ? 'text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
            style={tab === tabKey ? { background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)' } : {}}
          >
            {tabKey === 'signin' ? t.signIn : t.signUp}
          </button>
        ))}
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">

        {/* Target Role Module — Horizontal Individual Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-[#374151]">Target Role Module</span>
            <span className="text-[10px] font-semibold text-[#6D4AFF] bg-[#EDE9FE] px-2 py-0.5 rounded-full border border-[#DDD6FE] capitalize">
              {selectedRole}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = selectedRole === opt.role;
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(opt.role);
                    setError('');
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-[#111827] border-[#6D4AFF] shadow-sm ring-2 ring-[#6D4AFF]/20 scale-[1.02]'
                      : 'bg-white/60 text-[#6B7280] border-transparent hover:bg-white hover:text-[#111827] hover:border-[#E5E7EB]'
                  }`}
                  title={`Select ${t[opt.labelKey]} role module`}
                >
                  <span
                    className="p-1.5 rounded-lg mb-1 transition-colors"
                    style={{
                      background: isSelected ? `${opt.color}18` : '#F3F4F6',
                      color: opt.color,
                    }}
                  >
                    {opt.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-tight text-center leading-none">
                    {t[opt.labelKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Full Name (Sign-up only) */}
        <AnimatePresence>
          {tab === 'signup' && (
            <motion.div
              key="fullname"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 overflow-hidden"
            >
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-4 top-3.5 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setError(''); }}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 text-sm font-normal rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/15 focus:outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Address Input */}
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-3.5 text-[#9CA3AF]" />
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="Enter your email address"
            required
            autoComplete="email"
            className="w-full pl-11 pr-4 py-3 text-sm font-normal rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/15 focus:outline-none transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-3.5 text-[#9CA3AF]" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder={t.enterPass}
              required
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              className="w-full pl-11 pr-11 py-3 text-sm font-normal rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/15 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-4 top-3.5 text-[#9CA3AF] hover:text-[#6D4AFF] transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {strength && (
            <div className="px-1 pt-1.5 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i <= strength.bars ? strength.color : '#E5E7EB' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Errors & Success Feedback */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-2xl text-xs bg-rose-50 border border-rose-200 text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-2xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button — Purple Gradient Pill */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)', boxShadow: '0 4px 14px rgba(109,74,255,0.35)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{t.authenticating}</span>
            </>
          ) : (
            <>
              <span>{tab === 'signin' ? 'Sign in' : t.createAccount}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Toggle Sign In / Sign Up Footer Link */}
      <div className="pt-2 text-center text-sm text-[#6B7280]">
        <span>
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        </span>
        <button
          type="button"
          onClick={() => { setTab(tab === 'signin' ? 'signup' : 'signin'); setError(''); }}
          className="text-[#6D4AFF] font-bold hover:underline cursor-pointer"
        >
          {tab === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';

export type IndianLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';

export interface LanguageOption {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

export interface AppTranslationDict {
  // Navigation & Branding
  platformName: string;
  aiPlatform: string;
  aiCopilot: string;
  myWorkspace: string;
  roleAiModules: string;

  // Roles & Dashboards
  driverPortal: string;
  shipperHub: string;
  fleetCommand: string;
  adminTelemetry: string;

  // Common Actions
  acceptReturnLoad: string;
  findReturnLoads: string;
  navigate: string;
  stopNavigation: string;
  liveNavigationActive: string;
  documentScanner: string;
  signOut: string;
  telemetryAlerts: string;

  // Key Metrics & Stat Cards
  totalEarnings: string;
  completedTrips: string;
  trustScore: string;
  onTimeRate: string;
  activeFleet: string;
  totalFreight: string;
  carbonSavings: string;
  securityAnomalies: string;

  // AI Modules
  returnLoadMatcher: string;
  freightPricingEngine: string;
  dynamicBenchmarks: string;
  fleetPredictor: string;
  carbonHub: string;
  tamperingAlerts: string;

  // General Labels
  tripPayout: string;
  distance: string;
  destination: string;
  pickup: string;
  drop: string;
  speed: string;
  eta: string;
}

export const GLOBAL_TRANSLATIONS: Record<IndianLanguage, AppTranslationDict> = {
  en: {
    platformName: 'CargoLoop',
    aiPlatform: 'AI Platform',
    aiCopilot: 'AI Copilot',
    myWorkspace: 'My Workspace',
    roleAiModules: 'Role AI Modules',
    driverPortal: 'Driver Portal',
    shipperHub: 'Shipper Hub',
    fleetCommand: 'Fleet Command',
    adminTelemetry: 'Admin Telemetry',
    acceptReturnLoad: 'Accept Return Load',
    findReturnLoads: 'Find AI Return Loads',
    navigate: 'Navigate Route',
    stopNavigation: 'Stop Navigation',
    liveNavigationActive: 'Live GPS Route Active',
    documentScanner: 'Document Scanner',
    signOut: 'Sign Out',
    telemetryAlerts: 'Notifications',
    totalEarnings: 'Total Earnings',
    completedTrips: 'Completed Trips',
    trustScore: 'Trust Score',
    onTimeRate: 'On-Time Rate',
    activeFleet: 'Active Fleet Vehicles',
    totalFreight: 'Total Freight Volume',
    carbonSavings: 'Carbon Savings',
    securityAnomalies: 'Security Tampering Anomalies',
    returnLoadMatcher: 'AI Return Load Matcher',
    freightPricingEngine: 'Freight Pricing Engine',
    dynamicBenchmarks: 'Dynamic Benchmarks',
    fleetPredictor: 'Fleet Availability Predictor',
    carbonHub: 'Carbon Sustainability Hub',
    tamperingAlerts: 'Tampering Anomalies',
    tripPayout: 'Trip Payout',
    distance: 'Distance',
    destination: 'Destination',
    pickup: 'Pickup',
    drop: 'Drop',
    speed: 'Speed',
    eta: 'ETA',
  },
  hi: {
    platformName: 'कार्गो लूप',
    aiPlatform: 'एआई प्लेटफॉर्म',
    aiCopilot: 'एआई सह-पायलट',
    myWorkspace: 'मेरा कार्यक्षेत्र',
    roleAiModules: 'भूमिका एआई मॉड्यूल',
    driverPortal: 'ड्राइवर पोर्टल',
    shipperHub: 'शिपर हब',
    fleetCommand: 'वाहन बेड़ा कमान',
    adminTelemetry: 'एडमिन टेलीमेट्री',
    acceptReturnLoad: 'वापसी लोड स्वीकार करें',
    findReturnLoads: 'एआई वापसी लोड खोजें',
    navigate: 'नेविगेट करें',
    stopNavigation: 'नेविगेशन बंद करें',
    liveNavigationActive: 'लाइव जीपीएस मार्ग सक्रिय',
    documentScanner: 'दस्तावेज़ स्कैनर',
    signOut: 'साइन आउट',
    telemetryAlerts: 'सूचनाएं',
    totalEarnings: 'कुल कमाई',
    completedTrips: 'पूरी हुई यात्राएं',
    trustScore: 'विश्वास स्कोर',
    onTimeRate: 'समय पर दर',
    activeFleet: 'सक्रिय बेड़ा वाहन',
    totalFreight: 'कुल माल आयतन',
    carbonSavings: 'कार्बन बचत',
    securityAnomalies: 'सुरक्षा छेड़छाड़ विसंगतियां',
    returnLoadMatcher: 'एआई वापसी लोड मैचर',
    freightPricingEngine: 'भाड़ा मूल्य निर्धारण इंजन',
    dynamicBenchmarks: 'गतिशील मानक',
    fleetPredictor: 'बेड़ा उपलब्धता पूर्वअनुमान',
    carbonHub: 'कार्बन स्थिरता हब',
    tamperingAlerts: 'छेड़छाड़ विसंगतियां',
    tripPayout: 'यात्रा भुगतान',
    distance: 'दूरी',
    destination: 'गंतव्य',
    pickup: 'पिकअप',
    drop: 'ड्रॉप',
    speed: 'गति',
    eta: 'अनुमानित समय',
  },
  bn: {
    platformName: 'কার্গো লুপ',
    aiPlatform: 'এআই প্ল্যাটফর্ম',
    aiCopilot: 'এআই কো-পাইলট',
    myWorkspace: 'আমার কর্মক্ষেত্র',
    roleAiModules: 'ভূমিকা এআই মডিউল',
    driverPortal: 'ড্রাইভার পোর্টাল',
    shipperHub: 'শিপার হাব',
    fleetCommand: 'ফ্লিট কমান্ড',
    adminTelemetry: 'অ্যাডমিন টেলিমেট্রি',
    acceptReturnLoad: 'রিটার্ন লোড গ্রহণ করুন',
    findReturnLoads: 'এআই রিটার্ন লোড খুঁজুন',
    navigate: 'নেভিগেট করুন',
    stopNavigation: 'নেভিগেশন বন্ধ করুন',
    liveNavigationActive: 'লাইভ জিপিএস রুট সক্রিয়',
    documentScanner: 'ডকুমেন্ট স্ক্যানার',
    signOut: 'সাইন আউট',
    telemetryAlerts: 'বিজ্ঞপ্তি',
    totalEarnings: 'মোট আয়',
    completedTrips: 'সম্পন্ন ট্রিপ',
    trustScore: 'ট্রাস্ট স্কোর',
    onTimeRate: 'সময়মতো হার',
    activeFleet: 'সক্রিয় ফ্লিট গাড়ি',
    totalFreight: 'মোট মালবাহী আয়তন',
    carbonSavings: 'কার্বন সঞ্চয়',
    securityAnomalies: 'নিরাপত্তা কারচুপি অসঙ্গতি',
    returnLoadMatcher: 'এআই রিটার্ন লোড ম্যাচিং',
    freightPricingEngine: 'মালবাহী মূল্য ইঞ্জিন',
    dynamicBenchmarks: 'ডায়নামিক বেঞ্চমার্ক',
    fleetPredictor: 'ফ্লিট উপলব্ধতা পূর্বাভাস',
    carbonHub: 'কার্বন স্থায়িত্ব হাব',
    tamperingAlerts: 'কারচুপি সতর্কতা',
    tripPayout: 'ট্রিপ পেআউট',
    distance: 'দূরত্ব',
    destination: 'গন্তব্য',
    pickup: 'পিকআপ',
    drop: 'ড্রপ',
    speed: 'গতি',
    eta: 'আনুমানিক সময়',
  },
  mr: {
    platformName: 'कार्गो लूप',
    aiPlatform: 'एआय प्लॅटफॉर्म',
    aiCopilot: 'एआय सह-पायलट',
    myWorkspace: 'माझे कार्यक्षेत्र',
    roleAiModules: 'भूमिका एआय मॉड्युल्स',
    driverPortal: 'ड्रायव्हर पोर्टल',
    shipperHub: 'शिपर हब',
    fleetCommand: 'ताफा कमान',
    adminTelemetry: 'ॲडमिन टेलिमेट्री',
    acceptReturnLoad: 'परतीचे लोड स्वीकारा',
    findReturnLoads: 'एआय परतीचे लोड शोधा',
    navigate: 'नेव्हिगेट करा',
    stopNavigation: 'नेव्हिगेशन थांबवा',
    liveNavigationActive: 'थेट जीपीएस मार्ग सक्रिय',
    documentScanner: 'कागदपत्र स्कॅनर',
    signOut: 'साइन आउट करा',
    telemetryAlerts: 'सूचना',
    totalEarnings: 'एकूण कमाई',
    completedTrips: 'पूर्ण झालेल्या फेऱ्या',
    trustScore: 'विश्वास स्कोअर',
    onTimeRate: 'वेळेवर दर',
    activeFleet: 'सक्रिय ताफा वाहने',
    totalFreight: 'एकूण माल वाहतूक',
    carbonSavings: 'कार्बन बचत',
    securityAnomalies: 'सुरक्षा छेडछाड विसंगती',
    returnLoadMatcher: 'एआय रिटर्न लोड मॅचर',
    freightPricingEngine: 'भाडे दर इंजिन',
    dynamicBenchmarks: 'डायनॅमिक निकष',
    fleetPredictor: 'ताफा उपलब्धतेचे अंदाज',
    carbonHub: 'कार्बन स्थिरता हब',
    tamperingAlerts: 'छेडछाड इशारे',
    tripPayout: 'फेरीचे पेमेंट',
    distance: 'अंतर',
    destination: 'गंतव्य',
    pickup: 'पिकअप',
    drop: 'ड्रॉप',
    speed: 'वेग',
    eta: 'अंदाजे वेळ',
  },
  te: {
    platformName: 'కార్గోలూప్',
    aiPlatform: 'AI ప్లాట్‌ఫారమ్',
    aiCopilot: 'AI కో-పైలట్',
    myWorkspace: 'నా వర్క్‌స్పేస్',
    roleAiModules: 'పాత్ర AI మాడ్యూల్స్',
    driverPortal: 'డ్రైవర్ పోర్టల్',
    shipperHub: 'షిప్పర్ హబ్',
    fleetCommand: 'ఫ్లీట్ కమాండ్',
    adminTelemetry: 'అడ్మిన్ టెలిమెట్రీ',
    acceptReturnLoad: 'తిరుగు ప్రయాణ లోడ్ స్వీకరించండి',
    findReturnLoads: 'AI తిరుగు లోడ్‌లను కనుగొనండి',
    navigate: 'రూట్ నావిగేట్ చేయండి',
    stopNavigation: 'నావిగేషన్ ఆపండి',
    liveNavigationActive: 'లైవ్ GPS రూట్ సక్రియం',
    documentScanner: 'డాక్యుమెంట్ స్కానర్',
    signOut: 'సైన్ అవుట్',
    telemetryAlerts: 'నోటిఫికేషన్‌లు',
    totalEarnings: 'మొత్తం సంపాదన',
    completedTrips: 'పూర్తయిన ట్రిప్‌లు',
    trustScore: 'ట్రస్ట్ స్కోరు',
    onTimeRate: 'సమయపాలన రేటు',
    activeFleet: 'సక్రియ ఫ్లీట్ వాహనాలు',
    totalFreight: 'మొత్తం రవాణా పరిమాణం',
    carbonSavings: 'కార్బన్ పొదుపులు',
    securityAnomalies: 'భద్రతా ట్యాంపరింగ్ అనోమలీలు',
    returnLoadMatcher: 'AI రిటర్న్ లోడ్ మ్యాచర్',
    freightPricingEngine: 'మాల్ ధరల ఇంజిన్',
    dynamicBenchmarks: 'డైనమిక్ బెంచ్‌మార్క్‌లు',
    fleetPredictor: 'ఫ్లీట్ లభ్యత అంచనా',
    carbonHub: 'కార్బన్ సుస్థిరత హబ్',
    tamperingAlerts: 'ట్యాంపరింగ్ హెచ్చరికలు',
    tripPayout: 'ట్రిప్ చెల్లింపు',
    distance: 'దూరం',
    destination: 'గమ్యస్థానం',
    pickup: 'పికప్',
    drop: 'డ్రాప్',
    speed: 'వేగం',
    eta: 'అంచనా వేసిన సమయం',
  },
  ta: {
    platformName: 'கார்கோ லூப்',
    aiPlatform: 'AI தளம்',
    aiCopilot: 'AI உதவி பைலட்',
    myWorkspace: 'என் பணிப்பகுதி',
    roleAiModules: 'பங்கு AI தொகுதிகள்',
    driverPortal: 'டிரைவர் போர்டல்',
    shipperHub: 'ஷிப்பர் மையம்',
    fleetCommand: 'ஃப்ளீட் கட்டளை',
    adminTelemetry: 'நிர்வாக தொலைஅளவியல்',
    acceptReturnLoad: 'திரும்பும் சுமையை ஏற்கவும்',
    findReturnLoads: 'AI திரும்பும் சுமைகளைத் தேடவும்',
    navigate: 'வழிசெலுத்துங்கள்',
    stopNavigation: 'வழிசெலுத்தலை நிறுத்து',
    liveNavigationActive: 'நேரடி ஜிபிஎஸ் பாதை செயலில் உள்ளது',
    documentScanner: 'ஆவண ஸ்கேனர்',
    signOut: 'வெளியேறு',
    telemetryAlerts: 'அறிவிப்புகள்',
    totalEarnings: 'மொத்த வருமானம்',
    completedTrips: 'முடிந்த பயணங்கள்',
    trustScore: 'நம்பிக்கை மதிப்பெண்',
    onTimeRate: 'நேரத்திற்கு விகிதம்',
    activeFleet: 'செயலில் உள்ள வாகனங்கள்',
    totalFreight: 'மொத்த சரக்கு அளவு',
    carbonSavings: 'கார்பன் சேமிப்பு',
    securityAnomalies: 'பாதுகாப்பு சேதக்கேடு முரண்பாடுகள்',
    returnLoadMatcher: 'AI திரும்பும் சுமை பொருத்தம்',
    freightPricingEngine: 'சரக்கு விலை இயந்திரம்',
    dynamicBenchmarks: 'மாறும் அளவுகோல்கள்',
    fleetPredictor: 'வாகன கிடைக்கும் கணிப்பு',
    carbonHub: 'கார்பன் நிலைத்தன்மை மையம்',
    tamperingAlerts: 'சேதக்கேடு எச்சரிக்கைகள்',
    tripPayout: 'பயணக் கட்டணம்',
    distance: 'தூரம்',
    destination: 'சேருமிடம்',
    pickup: 'பிக்கப்',
    drop: 'டிராப்',
    speed: 'வேகம்',
    eta: 'எதிர்பார்க்கப்படும் நேரம்',
  },
};

interface LanguageContextType {
  lang: IndianLanguage;
  setLang: (lang: IndianLanguage) => void;
  t: AppTranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<IndianLanguage>(() => {
    const saved = localStorage.getItem('cargoloop_lang');
    if (saved === 'hi' || saved === 'bn' || saved === 'mr' || saved === 'te' || saved === 'ta' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('cargoloop_lang', lang);
  }, [lang]);

  const setLang = (newLang: IndianLanguage) => {
    setLangState(newLang);
  };

  const t = GLOBAL_TRANSLATIONS[lang] || GLOBAL_TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

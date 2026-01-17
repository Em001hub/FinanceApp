import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      // Greetings
      'greeting.morning': 'Good Morning',
      'greeting.afternoon': 'Good Afternoon', 
      'greeting.evening': 'Good Evening',
      'greeting.subtitle': 'Your Financial Command Center',
      
      // Dashboard sections
      'dashboard.financialOverview': 'Financial Overview',
      'dashboard.inclusionScore': 'Inclusion Score',
      'dashboard.riskProfile': 'Risk Profile',
      'dashboard.monthlySpend': 'Monthly Spend',
      'dashboard.creditHealth': 'Credit Health',
      'dashboard.savingsRatio': 'Savings Ratio',
      'dashboard.creditUtilization': 'Credit Utilization',
      
      // Security
      'security.status': 'Security Status',
      'security.lastScan': 'Last scan: Just now',
      'security.allClear': 'All Clear - No Suspicious Activity',
      'security.viewDetails': 'View Details',
      
      // Loan
      'loan.eligibility': 'Loan Eligibility',
      'loan.personalLoan': 'Personal Loan',
      'loan.applyNow': 'Apply Now',
      
      // Activity
      'activity.feed': 'Platform Activity Feed',
      'activity.viewAll': 'View All',
      
      // Credit & Inclusion
      'credit.learnMore': 'Learn More',
      
      // Scam Detection
      'scam.numberCheck': 'Scam Number Check',
      'scam.checkSuspicious': 'Check suspicious phone numbers',
      'scam.enterPhone': 'Enter phone number',
      'scam.check': 'Check',
      
      // Message Scanner
      'message.scanner': 'Message Safety Scanner',
      'message.scanSuspicious': 'Scan suspicious messages',
      'message.pasteHere': 'Paste message here...',
      'message.scan': 'Scan Message',
      
      // Common
      'common.outOf': 'Out of',
      'common.error': 'Error',
      'common.success': 'Success',
      
      // Detailed Views
      'security.details.title': 'Security Details',
      'credit.education.title': 'Credit Education',
      'activity.history.title': 'Activity History',
      'risk.profile.title': 'Risk Profile',
      'investment.guidance.title': 'Investment Guidance'
    }
  },
  hi: {
    translation: {
      // Greetings
      'greeting.morning': 'सुप्रभात',
      'greeting.afternoon': 'नमस्कार',
      'greeting.evening': 'शुभ संध्या',
      'greeting.subtitle': 'आपका वित्तीय कमांड सेंटर',
      
      // Dashboard sections
      'dashboard.financialOverview': 'वित्तीय अवलोकन',
      'dashboard.inclusionScore': 'समावेश स्कोर',
      'dashboard.riskProfile': 'जोखिम प्रोफ़ाइल',
      'dashboard.monthlySpend': 'मासिक खर्च',
      'dashboard.creditHealth': 'क्रेडिट स्वास्थ्य',
      'dashboard.savingsRatio': 'बचत अनुपात',
      'dashboard.creditUtilization': 'क्रेडिट उपयोग',
      
      // Security
      'security.status': 'सुरक्षा स्थिति',
      'security.lastScan': 'अंतिम स्कैन: अभी',
      'security.allClear': 'सब ठीक - कोई संदिग्ध गतिविधि नहीं',
      'security.viewDetails': 'विवरण देखें',
      
      // Loan
      'loan.eligibility': 'ऋण पात्रता',
      'loan.personalLoan': 'व्यक्तिगत ऋण',
      'loan.applyNow': 'अभी आवेदन करें',
      
      // Activity
      'activity.feed': 'प्लेटफॉर्म गतिविधि फ़ीड',
      'activity.viewAll': 'सभी देखें',
      
      // Credit & Inclusion
      'credit.learnMore': 'और जानें',
      
      // Scam Detection
      'scam.numberCheck': 'स्कैम नंबर जांच',
      'scam.checkSuspicious': 'संदिग्ध फोन नंबर जांचें',
      'scam.enterPhone': 'फोन नंबर दर्ज करें',
      'scam.check': 'जांचें',
      
      // Message Scanner
      'message.scanner': 'संदेश सुरक्षा स्कैनर',
      'message.scanSuspicious': 'संदिग्ध संदेशों को स्कैन करें',
      'message.pasteHere': 'यहाँ संदेश पेस्ट करें...',
      'message.scan': 'संदेश स्कैन करें',
      
      // Common
      'common.outOf': 'में से',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      
      // Detailed Views
      'security.details.title': 'सुरक्षा विवरण',
      'credit.education.title': 'क्रेडिट शिक्षा',
      'activity.history.title': 'गतिविधि इतिहास',
      'risk.profile.title': 'जोखिम प्रोफ़ाइल',
      'investment.guidance.title': 'निवेश मार्गदर्शन'
    }
  },
  te: {
    translation: {
      // Greetings
      'greeting.morning': 'శుభోదయం',
      'greeting.afternoon': 'నమస్కారం',
      'greeting.evening': 'శుభ సాయంత్రం',
      'greeting.subtitle': 'మీ ఆర్థిక కమాండ్ సెంటర్',
      
      // Dashboard sections
      'dashboard.financialOverview': 'ఆర్థిక అవలోకనం',
      'dashboard.inclusionScore': 'చేరిక స్కోర్',
      'dashboard.riskProfile': 'రిస్క్ ప్రొఫైల్',
      'dashboard.monthlySpend': 'నెలవారీ ఖర్చు',
      'dashboard.creditHealth': 'క్రెడిట్ ఆరోగ్యం',
      'dashboard.savingsRatio': 'పొదుపు నిష్పత్తి',
      'dashboard.creditUtilization': 'క్రెడిట్ వినియోగం',
      
      // Security
      'security.status': 'భద్రతా స్థితి',
      'security.lastScan': 'చివరి స్కాన్: ఇప్పుడే',
      'security.allClear': 'అంతా క్లియర్ - అనుమానాస్పద కార్యకలాపాలు లేవు',
      'security.viewDetails': 'వివరాలు చూడండి',
      
      // Loan
      'loan.eligibility': 'రుణ అర్హత',
      'loan.personalLoan': 'వ్యక్తిగత రుణం',
      'loan.applyNow': 'ఇప్పుడే దరఖాస్తు చేయండి',
      
      // Activity
      'activity.feed': 'ప్లాట్‌ఫారమ్ కార్యకలాప ఫీడ్',
      'activity.viewAll': 'అన్నీ చూడండి',
      
      // Credit & Inclusion
      'credit.learnMore': 'మరింత తెలుసుకోండి',
      
      // Scam Detection
      'scam.numberCheck': 'స్కామ్ నంబర్ తనిఖీ',
      'scam.checkSuspicious': 'అనుమానాస్పద ఫోన్ నంబర్లను తనిఖీ చేయండి',
      'scam.enterPhone': 'ఫోన్ నంబర్ నమోదు చేయండి',
      'scam.check': 'తనిఖీ చేయండి',
      
      // Message Scanner
      'message.scanner': 'సందేశ భద్రతా స్కానర్',
      'message.scanSuspicious': 'అనుమానాస్పద సందేశాలను స్కాన్ చేయండి',
      'message.pasteHere': 'ఇక్కడ సందేశం పేస్ట్ చేయండి...',
      'message.scan': 'సందేశం స్కాన్ చేయండి',
      
      // Common
      'common.outOf': 'లో',
      'common.error': 'లోపం',
      'common.success': 'విజయం'
    }
  },
  ma: {
    translation: {
      // Greetings
      'greeting.morning': 'सुप्रभात',
      'greeting.afternoon': 'नमस्कार',
      'greeting.evening': 'शुभ संध्याकाळ',
      'greeting.subtitle': 'तुमचे आर्थिक कमांड सेंटर',
      
      // Dashboard sections
      'dashboard.financialOverview': 'आर्थिक विहंगावलोकन',
      'dashboard.inclusionScore': 'समावेश स्कोअर',
      'dashboard.riskProfile': 'जोखीम प्रोफाइल',
      'dashboard.monthlySpend': 'मासिक खर्च',
      'dashboard.creditHealth': 'क्रेडिट आरोग्य',
      'dashboard.savingsRatio': 'बचत गुणोत्तर',
      'dashboard.creditUtilization': 'क्रेडिट वापर',
      
      // Security
      'security.status': 'सुरक्षा स्थिती',
      'security.lastScan': 'शेवटचे स्कॅन: आत्ताच',
      'security.allClear': 'सर्व स्पष्ट - कोणतीही संशयास्पद क्रिया नाही',
      'security.viewDetails': 'तपशील पहा',
      
      // Loan
      'loan.eligibility': 'कर्ज पात्रता',
      'loan.personalLoan': 'वैयक्तिक कर्ज',
      'loan.applyNow': 'आता अर्ज करा',
      
      // Activity
      'activity.feed': 'प्लॅटफॉर्म क्रियाकलाप फीड',
      'activity.viewAll': 'सर्व पहा',
      
      // Credit & Inclusion
      'credit.learnMore': 'अधिक जाणून घ्या',
      
      // Scam Detection
      'scam.numberCheck': 'स्कॅम नंबर तपासणी',
      'scam.checkSuspicious': 'संशयास्पद फोन नंबर तपासा',
      'scam.enterPhone': 'फोन नंबर प्रविष्ट करा',
      'scam.check': 'तपासा',
      
      // Message Scanner
      'message.scanner': 'संदेश सुरक्षा स्कॅनर',
      'message.scanSuspicious': 'संशयास्पद संदेश स्कॅन करा',
      'message.pasteHere': 'येथे संदेश पेस्ट करा...',
      'message.scan': 'संदेश स्कॅन करा',
      
      // Common
      'common.outOf': 'पैकी',
      'common.error': 'त्रुटी',
      'common.success': 'यश'
    }
  },
  bn: {
    translation: {
      // Greetings
      'greeting.morning': 'সুপ্রভাত',
      'greeting.afternoon': 'নমস্কার',
      'greeting.evening': 'শুভ সন্ধ্যা',
      'greeting.subtitle': 'আপনার আর্থিক কমান্ড সেন্টার',
      
      // Dashboard sections
      'dashboard.financialOverview': 'আর্থিক সংক্ষিপ্ত বিবরণ',
      'dashboard.inclusionScore': 'অন্তর্ভুক্তি স্কোর',
      'dashboard.riskProfile': 'ঝুঁকি প্রোফাইল',
      'dashboard.monthlySpend': 'মাসিক খরচ',
      'dashboard.creditHealth': 'ক্রেডিট স্বাস্থ্য',
      'dashboard.savingsRatio': 'সঞ্চয় অনুপাত',
      'dashboard.creditUtilization': 'ক্রেডিট ব্যবহার',
      
      // Security
      'security.status': 'নিরাপত্তা অবস্থা',
      'security.lastScan': 'শেষ স্ক্যান: এখনই',
      'security.allClear': 'সব পরিষ্কার - কোন সন্দেহজনক কার্যকলাপ নেই',
      'security.viewDetails': 'বিস্তারিত দেখুন',
      
      // Loan
      'loan.eligibility': 'ঋণের যোগ্যতা',
      'loan.personalLoan': 'ব্যক্তিগত ঋণ',
      'loan.applyNow': 'এখনই আবেদন করুন',
      
      // Activity
      'activity.feed': 'প্ল্যাটফর্ম কার্যকলাপ ফিড',
      'activity.viewAll': 'সব দেখুন',
      
      // Credit & Inclusion
      'credit.learnMore': 'আরও জানুন',
      
      // Scam Detection
      'scam.numberCheck': 'স্ক্যাম নম্বর চেক',
      'scam.checkSuspicious': 'সন্দেহজনক ফোন নম্বর চেক করুন',
      'scam.enterPhone': 'ফোন নম্বর লিখুন',
      'scam.check': 'চেক করুন',
      
      // Message Scanner
      'message.scanner': 'বার্তা নিরাপত্তা স্ক্যানার',
      'message.scanSuspicious': 'সন্দেহজনক বার্তা স্ক্যান করুন',
      'message.pasteHere': 'এখানে বার্তা পেস্ট করুন...',
      'message.scan': 'বার্তা স্ক্যান করুন',
      
      // Common
      'common.outOf': 'এর মধ্যে',
      'common.error': 'ত্রুটি',
      'common.success': 'সফলতা'
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export interface LanguageService {
  currentLanguage: string;
  supportedLanguages: string[];
  changeLanguage(language: string): Promise<void>;
  translate(key: string, params?: object): string;
}

class LanguageServiceImpl implements LanguageService {
  private static instance: LanguageServiceImpl;
  
  public static getInstance(): LanguageServiceImpl {
    if (!LanguageServiceImpl.instance) {
      LanguageServiceImpl.instance = new LanguageServiceImpl();
    }
    return LanguageServiceImpl.instance;
  }

  get currentLanguage(): string {
    return i18n.language;
  }

  get supportedLanguages(): string[] {
    return ['en', 'hi', 'te', 'ma', 'bn'];
  }

  async changeLanguage(language: string): Promise<void> {
    try {
      if (!this.supportedLanguages.includes(language)) {
        throw new Error(`Unsupported language: ${language}`);
      }
      
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('user_language', language);
    } catch (error) {
      console.error('Language change failed:', error);
      throw error;
    }
  }

  translate(key: string, params?: object): string {
    return i18n.t(key, params);
  }

  async loadSavedLanguage(): Promise<void> {
    try {
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load saved language:', error);
    }
  }
}

export const languageService = LanguageServiceImpl.getInstance();
export default i18n;
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

// Sample poll translations
const pollTranslations = {
  // Add sample translations for common poll questions/options
  en: {
    // Elections
    "President Election": "President Election",
    "Vice President Election": "Vice President Election",
    "Secretary Election": "Secretary Election",
    "Treasurer Election": "Treasurer Election",
    "Class Representative": "Class Representative",
    
    // Common candidates/options
    "John Doe": "John Doe",
    "Jane Smith": "Jane Smith",
    "Bob Johnson": "Bob Johnson",
    "Alice Brown": "Alice Brown",
    "Yes": "Yes",
    "No": "No",
    "Abstain": "Abstain",
    "Option 1": "Option 1",
    "Option 2": "Option 2",
    "Option 3": "Option 3",
    
    // Common descriptions
    "Please select your preferred candidate": "Please select your preferred candidate",
    "Vote for the next student body president": "Vote for the next student body president",
    "Choose the best candidate for the position": "Choose the best candidate for the position"
  },
  hi: {
    // Elections
    "President Election": "अध्यक्ष चुनाव",
    "Vice President Election": "उपाध्यक्ष चुनाव",
    "Secretary Election": "सचिव चुनाव",
    "Treasurer Election": "कोषाध्यक्ष चुनाव",
    "Class Representative": "कक्षा प्रतिनिधि",
    
    // Common candidates/options
    "John Doe": "जॉन डो",
    "Jane Smith": "जेन स्मिथ",
    "Bob Johnson": "बॉब जॉनसन",
    "Alice Brown": "एलिस ब्राउन",
    "Yes": "हां",
    "No": "नहीं",
    "Abstain": "मतदान से दूर रहें",
    "Option 1": "विकल्प 1",
    "Option 2": "विकल्प 2",
    "Option 3": "विकल्प 3",
    
    // Common descriptions
    "Please select your preferred candidate": "कृपया अपने पसंदीदा उम्मीदवार का चयन करें",
    "Vote for the next student body president": "अगले छात्र संघ अध्यक्ष के लिए मतदान करें",
    "Choose the best candidate for the position": "पद के लिए सबसे अच्छे उम्मीदवार का चयन करें"
  }
};

// Translations for English and Hindi
const translations = {
  en: {
    // Vote page
    castYourVote: "Cast Your Vote",
    enterSecureToken: "Enter your secure voting token to access your ballot",
    votingToken: "Voting Token",
    enterToken: "Enter your secure token",
    tokenProvided: "The voting token was provided to you by the poll organizer",
    accessBallot: "Access Ballot",
    noToken: "Don't have a voting token? Contact the poll organizer.",
    returnHome: "Return to Home",
    anonymous: "All votes are anonymous and encrypted end-to-end",
    
    // Vote token page
    validatingToken: "Validating your voting token...",
    tokenError: "Token Error",
    tryAnotherToken: "Try Another Token",
    voteSubmitted: "Vote Submitted",
    thankYou: "Thank you for voting! You will be redirected to the results page shortly.",
    redirecting: "Redirecting...",
    pollNotFound: "Poll Not Found",
    pollNotFoundDesc: "The poll associated with this token could not be found.",
    pollClosed: "Poll Closed",
    pollEndedOn: "This poll ended on {date} and is no longer accepting votes.",
    viewResults: "View Results",
    selectOption: "Select one option below",
    submit: "Submit Vote",
    votingFor: "You are voting for:",
    tokenInfo: "Token: {token}",
    pollEnds: "Poll ends: {date}",
    changeToken: "Use a different token",
    
    // Error messages
    invalidTokenFormat: "Invalid token format",
    tokenAlreadyUsed: "This token has already been used",
    pollNotFoundForToken: "Poll not found for this token",
    invalidToken: "Invalid token",
    errorValidatingToken: "Error validating token",
    errorSubmittingVote: "Error submitting your vote. Please try again.",
  },
  hi: {
    // Vote page
    castYourVote: "अपना वोट दें",
    enterSecureToken: "अपने मतपत्र तक पहुंचने के लिए अपना सुरक्षित मतदान टोकन दर्ज करें",
    votingToken: "मतदान टोकन",
    enterToken: "अपना सुरक्षित टोकन दर्ज करें",
    tokenProvided: "मतदान टोकन आपको मतदान आयोजक द्वारा प्रदान किया गया था",
    accessBallot: "मतपत्र एक्सेस करें",
    noToken: "मतदान टोकन नहीं है? मतदान आयोजक से संपर्क करें।",
    returnHome: "होम पर वापस जाएं",
    anonymous: "सभी वोट गुमनाम हैं और एंड-टू-एंड एन्क्रिप्टेड हैं",
    
    // Vote token page
    validatingToken: "आपके मतदान टोकन का सत्यापन किया जा रहा है...",
    tokenError: "टोकन त्रुटि",
    tryAnotherToken: "एक अलग टोकन आज़माएं",
    voteSubmitted: "वोट सबमिट किया गया",
    thankYou: "मतदान के लिए धन्यवाद! आपको जल्द ही परिणाम पृष्ठ पर पुनर्निर्देशित किया जाएगा।",
    redirecting: "पुनर्निर्देशित किया जा रहा है...",
    pollNotFound: "मतदान नहीं मिला",
    pollNotFoundDesc: "इस टोकन से संबंधित मतदान नहीं मिला।",
    pollClosed: "मतदान बंद",
    pollEndedOn: "यह मतदान {date} को समाप्त हो गया और अब वोट स्वीकार नहीं कर रहा है।",
    viewResults: "परिणाम देखें",
    selectOption: "नीचे एक विकल्प चुनें",
    submit: "वोट सबमिट करें",
    votingFor: "आप इसके लिए वोट दे रहे हैं:",
    tokenInfo: "टोकन: {token}",
    pollEnds: "मतदान समाप्त: {date}",
    changeToken: "एक अलग टोकन का उपयोग करें",
    
    // Error messages
    invalidTokenFormat: "अमान्य टोकन प्रारूप",
    tokenAlreadyUsed: "यह टोकन पहले ही उपयोग किया जा चुका है",
    pollNotFoundForToken: "इस टोकन के लिए कोई मतदान नहीं मिला",
    invalidToken: "अमान्य टोकन",
    errorValidatingToken: "टोकन सत्यापित करने में त्रुटि",
    errorSubmittingVote: "आपका वोट सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translatePollContent: (content: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const translationSet = translations[language] as Record<string, string>;
    let translation = translationSet[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, value);
      });
    }
    
    return translation;
  };

  // Function to translate poll content (titles, descriptions, options)
  const translatePollContent = (content: string): string => {
    const pollTranslationSet = pollTranslations[language] as Record<string, string>;
    return pollTranslationSet[content] || content;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translatePollContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
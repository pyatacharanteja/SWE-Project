'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm ${
          language === 'en'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1 rounded-md text-sm ${
          language === 'hi'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
} 
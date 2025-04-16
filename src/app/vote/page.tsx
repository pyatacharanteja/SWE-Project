'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';

export default function Vote() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/vote/${encodeURIComponent(token.trim())}`);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('castYourVote')}</h1>
          <p className="text-gray-600">{t('enterSecureToken')}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                {t('votingToken')}
              </label>
              <input
                type="text"
                id="token"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={inputClass}
                placeholder={t('enterToken')}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {t('tokenProvided')}
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full"
              >
                {t('accessBallot')}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              {t('noToken')}
            </p>
            <Link 
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t('returnHome')}
            </Link>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center text-gray-500 text-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{t('anonymous')}</span>
        </div>
      </div>
    </div>
  );
} 
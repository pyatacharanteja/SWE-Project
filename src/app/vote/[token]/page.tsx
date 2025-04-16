'use client'

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageToggle } from '../../../components/LanguageToggle';

interface PollProps {
  params: {
    token: string;
  };
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  options?: string[];
  startDate?: Date;
  endDate: Date;
  voteCount: number;
  numTokens?: number;
  enableBlockchain?: boolean;
}

interface TokenInfo {
  pollId: string;
  tokenIndex: number;
  isValid: boolean;
}

export default function VotePage({ params }: PollProps) {
  const router = useRouter();
  const token = React.use(params).token;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t, translatePollContent } = useLanguage();
  
  // Parse the token to extract poll ID (format: poll-123-TOKEN-4)
  useEffect(() => {
    try {
      const decodedToken = decodeURIComponent(token);
      const tokenParts = decodedToken.split('-TOKEN-');
      
      if (tokenParts.length !== 2) {
        setError(t('invalidTokenFormat'));
        setLoading(false);
        return;
      }
      
      const pollId = tokenParts[0];
      const tokenIndex = parseInt(tokenParts[1], 10);
      
      // Check if token has been used
      const usedTokens = JSON.parse(localStorage.getItem('usedTokens') || '[]');
      const isUsed = usedTokens.includes(decodedToken);
      
      if (isUsed) {
        setError(t('tokenAlreadyUsed'));
        setLoading(false);
        return;
      }
      
      // Find the poll by ID
      const savedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      const foundPoll = savedPolls.find((p: Poll) => p.id === pollId);
      
      if (!foundPoll) {
        setError(t('pollNotFoundForToken'));
        setLoading(false);
        return;
      }
      
      // Validate token index is within range
      if (isNaN(tokenIndex) || tokenIndex < 1 || tokenIndex > (foundPoll.numTokens || 10)) {
        setError(t('invalidToken'));
        setLoading(false);
        return;
      }
      
      // Token is valid
      setTokenInfo({
        pollId,
        tokenIndex,
        isValid: true
      });
      
      setPoll({
        ...foundPoll,
        endDate: new Date(foundPoll.endDate),
        startDate: foundPoll.startDate ? new Date(foundPoll.startDate) : undefined
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error validating token:', error);
      setError(t('errorValidatingToken'));
      setLoading(false);
    }
  }, [token, t]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedOption || !poll || !tokenInfo) {
      return;
    }
    
    try {
      // Mark token as used
      const usedTokens = JSON.parse(localStorage.getItem('usedTokens') || '[]');
      usedTokens.push(decodeURIComponent(token));
      localStorage.setItem('usedTokens', JSON.stringify(usedTokens));
      
      // Update poll vote count
      const savedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      const updatedPolls = savedPolls.map((p: Poll) => {
        if (p.id === tokenInfo.pollId) {
          return {
            ...p,
            voteCount: (p.voteCount || 0) + 1
          };
        }
        return p;
      });
      
      localStorage.setItem('polls', JSON.stringify(updatedPolls));
      
      // Store vote result (in real app, this should be encrypted)
      const votes = JSON.parse(localStorage.getItem('votes') || '{}');
      if (!votes[tokenInfo.pollId]) {
        votes[tokenInfo.pollId] = {};
      }
      
      if (!votes[tokenInfo.pollId][selectedOption]) {
        votes[tokenInfo.pollId][selectedOption] = 0;
      }
      
      votes[tokenInfo.pollId][selectedOption]++;
      localStorage.setItem('votes', JSON.stringify(votes));
      
      setSubmitted(true);
      
      // Redirect to results after short delay
      setTimeout(() => {
        router.push(`/dashboard/polls/${tokenInfo.pollId}/results`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError(t('errorSubmittingVote'));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="flex justify-center py-12">
            <p className="text-gray-600">{t('validatingToken')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('tokenError')}</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/vote"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              {t('tryAnotherToken')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('voteSubmitted')}</h1>
            <p className="text-gray-600 mb-6">
              {t('thankYou')}
            </p>
            <div className="animate-pulse">{t('redirecting')}</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!poll || !tokenInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('pollNotFound')}</h1>
            <p className="text-gray-600 mb-6">{t('pollNotFoundDesc')}</p>
            <Link 
              href="/vote"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              {t('tryAnotherToken')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const isExpired = new Date(poll.endDate) < new Date();
  
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-orange-500 text-5xl mb-4">⏱️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('pollClosed')}</h1>
            <p className="text-gray-600 mb-6">
              {t('pollEndedOn', { date: new Date(poll.endDate).toLocaleDateString() })}
            </p>
            <Link 
              href={`/dashboard/polls/${tokenInfo.pollId}/results`}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              {t('viewResults')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-800">{translatePollContent(poll?.title || '')}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {t('pollEnds', { date: new Date(poll?.endDate || new Date()).toLocaleDateString() })}
            </p>
          </div>
          
          <div className="p-6">
            {poll?.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">{t('votingFor')}</h2>
                <p className="text-gray-600">{translatePollContent(poll.description)}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">{t('selectOption')}</h2>
                <div className="space-y-3">
                  {poll?.options?.map((option, index) => (
                    <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="vote"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        required
                      />
                      <span className="ml-3 text-gray-700">{translatePollContent(option)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedOption}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedOption
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/vote"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← {t('changeToken')}
          </Link>
        </div>
      </div>
    </div>
  );
} 
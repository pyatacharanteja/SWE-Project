'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PollProps {
  params: {
    id: string;
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

export default function ManagePoll({ params }: PollProps) {
  const router = useRouter();
  const pollId = React.use(params).id;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    // Load poll from localStorage
    try {
      if (typeof window !== 'undefined') {
        const savedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
        const foundPoll = savedPolls.find((p: Poll) => p.id === pollId);
        
        if (foundPoll) {
          // Ensure date is a Date object
          setPoll({
            ...foundPoll,
            endDate: new Date(foundPoll.endDate)
          });
          
          // Generate sample tokens for demo
          const demoTokens = Array(foundPoll.numTokens || 10)
            .fill(0)
            .map((_, i) => `${pollId}-TOKEN-${i+1}`);
            
          setTokens(demoTokens);
        }
      }
    } catch (error) {
      console.error('Error loading poll:', error);
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  const copyTokensToClipboard = () => {
    const tokenText = tokens.join('\n');
    navigator.clipboard.writeText(tokenText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const deletePoll = () => {
    try {
      const savedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
      const updatedPolls = savedPolls.filter((p: Poll) => p.id !== pollId);
      localStorage.setItem('polls', JSON.stringify(updatedPolls));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <p className="text-gray-600">Loading poll details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Poll Not Found</h1>
            <p className="text-gray-600 mb-6">The poll you are looking for does not exist or has been deleted.</p>
            <Link 
              href="/dashboard"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isActive = new Date(poll.endDate) > new Date();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link 
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-800 mr-4"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Manage Poll</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">{poll.title}</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isActive ? 'Active' : 'Completed'}
            </span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-800">{poll.description || 'No description provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <p className="text-gray-800">
                  {poll.voteCount} votes received so far
                </p>
                <p className="text-gray-600 text-sm">
                  Ends on {new Date(poll.endDate).toLocaleDateString()} at{' '}
                  {new Date(poll.endDate).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Options</h3>
                <ul className="list-disc pl-5 text-gray-800">
                  {poll.options?.map((option, index) => (
                    <li key={index}>{option}</li>
                  )) || <li>No options available</li>}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Security</h3>
                <p className="text-gray-800">
                  {poll.numTokens || 0} voting tokens generated
                </p>
                <p className="text-gray-600 text-sm">
                  {poll.enableBlockchain 
                    ? 'Blockchain verification enabled' 
                    : 'Standard verification method'
                  }
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Voting Tokens</h3>
              <p className="text-gray-600 mb-4">
                Share these tokens with participants to allow them to vote in your poll
              </p>
              
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto mb-4">
                {tokens.map((token, index) => (
                  <div key={index} className="text-gray-700 font-mono text-sm mb-1">
                    {token}
                  </div>
                ))}
              </div>
              
              <button
                onClick={copyTokensToClipboard}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              >
                {isCopied ? 'Copied!' : 'Copy All Tokens'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={deletePoll}
            className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            Delete Poll
          </button>
          
          <div className="space-x-4">
            <Link
              href={`/dashboard/polls/${pollId}/results`}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
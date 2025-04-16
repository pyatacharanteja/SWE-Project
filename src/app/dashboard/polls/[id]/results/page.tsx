'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
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

// Generate empty initial results
const generateInitialResults = (options: string[] = []) => {
  // If no options are available, return empty results
  if (options.length === 0) {
    return {
      results: [],
      totalVotes: 0
    };
  }
  
  // Create empty results for each option
  const results = options.map((option) => {
    return {
      option,
      votes: 0,
      percentage: 0
    };
  });
  
  return {
    results,
    totalVotes: 0
  };
};

export default function PollResults({ params }: PollProps) {
  const pollId = React.use(params).id;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>({ results: [], totalVotes: 0 });
  
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
          
          // Get actual vote results from localStorage
          const votes = JSON.parse(localStorage.getItem('votes') || '{}');
          const pollVotes = votes[pollId] || {};
          
          // If there are actual votes, use them, otherwise use empty initial results
          if (Object.keys(pollVotes).length > 0) {
            const totalVotes = Object.values(pollVotes).reduce((sum: any, count: any) => sum + count, 0);
            
            const results = Object.entries(pollVotes).map(([option, votes]) => {
              const voteCount = votes as number;
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              
              return {
                option,
                votes: voteCount,
                percentage
              };
            });
            
            setResults({
              results,
              totalVotes
            });
          } else {
            // Use empty initial results instead of mock data
            setResults(generateInitialResults(foundPoll.options));
          }
        }
      }
    } catch (error) {
      console.error('Error loading poll:', error);
    } finally {
      setLoading(false);
    }
  }, [pollId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <p className="text-gray-600">Loading poll results...</p>
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
  const hasVotes = results.totalVotes > 0;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link 
            href={`/dashboard/polls/${pollId}`}
            className="text-indigo-600 hover:text-indigo-800 mr-4"
          >
            &larr; Back to Poll Management
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Poll Results</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">{poll.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isActive 
                ? `Poll active until ${new Date(poll.endDate).toLocaleDateString()}` 
                : `Poll ended on ${new Date(poll.endDate).toLocaleDateString()}`
              }
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Voting Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800 font-medium">Total Votes</p>
                  <p className="text-2xl font-bold text-blue-900">{results.totalVotes}</p>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-800 font-medium">Participation Rate</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.round((results.totalVotes / (poll.numTokens || 10)) * 100)}%
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-800 font-medium">Poll Status</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {isActive ? 'Active' : 'Completed'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Results</h3>
              
              {!hasVotes && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No votes have been cast yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Results will appear here once people start voting.</p>
                </div>
              )}
              
              {hasVotes && (
                <div className="space-y-4">
                  {results.results.map((result: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-800">{result.option}</span>
                        <span className="text-gray-600">{result.votes} votes ({result.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {poll.enableBlockchain && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <h3 className="text-md font-medium text-yellow-800 mb-2">
                  Blockchain Verification
                </h3>
                <p className="text-yellow-700 text-sm">
                  This poll uses blockchain verification. All votes will be recorded on the
                  Ethereum blockchain for maximum security and transparency.
                </p>
                {hasVotes && (
                  <a 
                    href="#" 
                    className="text-yellow-800 hover:text-yellow-900 text-sm font-medium mt-2 inline-block"
                  >
                    View Blockchain Record
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link
            href="/dashboard"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Return to Dashboard
          </Link>
          
          <Link
            href={`/dashboard/polls/${pollId}`}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Manage Poll
          </Link>
        </div>
      </div>
    </div>
  );
} 
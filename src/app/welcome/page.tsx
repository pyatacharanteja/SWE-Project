'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function WelcomePage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Set username based on admin status
    setUserName(isAdmin ? 'Admin' : 'Voter');
    
    // No auto-redirect
  }, [isLoggedIn, isAdmin, router]);
  
  if (!isLoggedIn) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 py-12 max-w-3xl">
          <div className="mb-8 inline-block p-6 bg-white bg-opacity-10 rounded-full">
            <div className="text-5xl">
              {isAdmin ? '👑' : '🗳️'}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome{userName ? `, ${userName}` : ''}!
          </h1>
          
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-8">
            {isAdmin 
              ? 'You are logged in as an administrator. You can manage polls, view results, and analyze voting data.'
              : 'You are ready to cast your vote securely and anonymously. Your voice matters!'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href={isAdmin ? '/dashboard' : '/vote'}
              className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isAdmin ? 'Go to Dashboard' : 'Go to Vote'}
            </Link>
            
            {isAdmin && (
              <Link 
                href="/vote"
                className="bg-indigo-600 text-white border border-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Cast a Vote
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 bg-black bg-opacity-20 text-center">
        <p className="text-white text-opacity-70">
          Secure Voting System | © {new Date().getFullYear()} IITISM
        </p>
      </div>
    </div>
  );
} 
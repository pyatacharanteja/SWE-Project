'use client'

import Link from 'next/link';

export default function VoteConfirmation() {
  // Generate a mock transaction hash
  const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Vote Recorded Successfully!</h1>
            <p className="text-gray-600 mb-8">Your vote has been anonymously recorded and cannot be changed.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Verification Information</h2>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500">Blockchain Transaction</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-auto">
                    {txHash}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Timestamp</div>
                  <div className="font-mono text-sm">{new Date().toISOString()}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full max-w-xs"
              >
                Return to Home
              </Link>
              
              <button
                className="text-indigo-600 hover:text-indigo-800"
                onClick={handlePrint}
              >
                Print Receipt
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>This receipt does not reveal how you voted.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
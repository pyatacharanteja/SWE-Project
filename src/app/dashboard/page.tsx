'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock data for demonstration (will be used as fallback)
const mockPolls = [
  {
    id: 'poll-1',
    title: 'Company Board Election 2025',
    voteCount: 124,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    id: 'poll-2',
    title: 'Annual Budget Allocation',
    voteCount: 78,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    id: 'poll-3',
    title: 'Employee Benefits Survey',
    voteCount: 203,
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago (completed)
  }
];

export default function Dashboard() {
  const [polls, setPolls] = useState<typeof mockPolls>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPolls, setSelectedPolls] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    // Try to load polls from localStorage
    try {
      if (typeof window !== 'undefined') {
        const savedPolls = localStorage.getItem('polls');
        if (savedPolls) {
          const parsedPolls = JSON.parse(savedPolls);
          // Convert string dates back to Date objects
          const formattedPolls = parsedPolls.map((poll: any) => ({
            ...poll,
            endDate: new Date(poll.endDate)
          }));
          setPolls(formattedPolls);
        } else {
          // If no saved polls, use mock data
          setPolls(mockPolls);
        }
      }
    } catch (error) {
      console.error('Error loading polls:', error);
      setPolls(mockPolls);
    }
  }, []);

  const filteredPolls = polls.filter(poll => {
    if (filterStatus === 'active') {
      return new Date(poll.endDate) > new Date();
    } else if (filterStatus === 'completed') {
      return new Date(poll.endDate) <= new Date();
    }
    return true;
  });

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedPolls([]);
    setConfirmDelete(false);
  };

  const togglePollSelection = (pollId: string) => {
    if (selectedPolls.includes(pollId)) {
      setSelectedPolls(selectedPolls.filter(id => id !== pollId));
    } else {
      setSelectedPolls([...selectedPolls, pollId]);
    }
  };

  const selectAll = () => {
    if (selectedPolls.length === filteredPolls.length) {
      // If all are selected, deselect all
      setSelectedPolls([]);
    } else {
      // Otherwise, select all
      setSelectedPolls(filteredPolls.map(poll => poll.id));
    }
  };

  const deleteSelectedPolls = () => {
    if (confirmDelete) {
      // Filter out selected polls
      const updatedPolls = polls.filter(poll => !selectedPolls.includes(poll.id));
      setPolls(updatedPolls);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('polls', JSON.stringify(updatedPolls));
      }
      
      // Reset state
      setSelectedPolls([]);
      setConfirmDelete(false);
      setSelectMode(false);
    } else {
      // First click just shows confirmation
      setConfirmDelete(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Poll Dashboard</h1>
        
        {/* Action Buttons */}
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/dashboard/create"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
          >
            + Create New Poll
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectMode 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {selectMode ? 'Cancel' : 'Select Polls'}
            </button>
          </div>
        </div>
        
        {/* Polls List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Polls</h2>
              
              {selectMode && filteredPolls.length > 0 && (
                <button 
                  onClick={selectAll}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {selectedPolls.length === filteredPolls.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {selectMode && selectedPolls.length > 0 && (
                <button
                  onClick={deleteSelectedPolls}
                  className={`text-sm px-3 py-1 rounded ${
                    confirmDelete 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  {confirmDelete ? 'Confirm Delete' : 'Delete Selected'}
                </button>
              )}
              
              <select 
                className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 bg-white"
                aria-label="Filter polls"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Polls</option>
                <option value="active">Active Polls</option>
                <option value="completed">Completed Polls</option>
              </select>
            </div>
          </div>
          
          {filteredPolls.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No polls found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'Create your first poll to get started with secure voting'
                  : `No ${filterStatus} polls found`}
              </p>
              <Link 
                href="/dashboard/create"
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
              >
                Create Poll
              </Link>
            </div>
          ) : (
            /* Poll List */
            <div className="divide-y divide-gray-200">
              {filteredPolls.map((poll) => (
                <div key={poll.id} className={`px-6 py-4 flex justify-between items-center ${
                  selectedPolls.includes(poll.id) ? 'bg-indigo-50' : ''
                }`}>
                  <div className="flex items-center space-x-3">
                    {selectMode && (
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        checked={selectedPolls.includes(poll.id)}
                        onChange={() => togglePollSelection(poll.id)}
                        aria-label={`Select ${poll.title}`}
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800">{poll.title}</h3>
                      <p className="text-sm text-gray-500">
                        {poll.voteCount} votes · Ends {new Date(poll.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!selectMode && (
                    <div className="flex space-x-3">
                      <Link 
                        href={`/dashboard/polls/${poll.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Manage
                      </Link>
                      <Link 
                        href={`/dashboard/polls/${poll.id}/results`}
                        className="text-green-600 hover:text-green-800"
                      >
                        Results
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected Polls Count */}
        {selectMode && selectedPolls.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {selectedPolls.length} {selectedPolls.length === 1 ? 'poll' : 'polls'} selected
          </div>
        )}
      </div>
    </div>
  );
} 
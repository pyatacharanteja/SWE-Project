'use client'

import Link from 'next/link';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePoll() {
  const router = useRouter();
  const [options, setOptions] = useState(['', '']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numTokens, setNumTokens] = useState<number | string>(10);
  const [enableBlockchain, setEnableBlockchain] = useState(false);
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow direct input of numbers
    const value = e.target.value;
    setNumTokens(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new poll object with all fields
    const newPoll = {
      id: `poll-${Date.now()}`,
      title: title,
      description: description,
      options: options.filter(opt => opt.trim() !== ''),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      voteCount: 0,
      numTokens: typeof numTokens === 'string' ? parseInt(numTokens, 10) : numTokens,
      enableBlockchain: enableBlockchain,
      createdAt: new Date()
    };
    
    // In a real implementation, we would submit to an API
    // For demo purposes, we'll store in localStorage
    const existingPolls = JSON.parse(localStorage.getItem('polls') || '[]');
    const updatedPolls = [newPoll, ...existingPolls];
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    
    // Redirect back to dashboard
    router.push('/dashboard');
  };

  // Update the input styles to have better placeholder visibility
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-500";
  const textareaClass = inputClass;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center mb-8">
          <Link 
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-800 mr-4"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Create New Poll</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Poll Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Poll Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Poll Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    className={inputClass}
                    placeholder="Enter poll title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className={textareaClass}
                    placeholder="Provide details about your poll (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      className={inputClass}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      className={inputClass}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Poll Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Poll Options</h2>
              <p className="text-sm text-gray-600 mb-4">Add at least two options for voters to choose from</p>
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className={inputClass}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <button 
                      type="button"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      aria-label="Remove option"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                onClick={addOption}
              >
                + Add Another Option
              </button>
            </div>
            
            {/* Security Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="tokens" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Voting Tokens*
                  </label>
                  <input
                    type="number"
                    id="tokens"
                    min="1"
                    className={inputClass}
                    placeholder="Enter number of tokens"
                    value={numTokens}
                    onChange={handleNumberChange}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This determines how many people can vote in your poll
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="blockchain"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={enableBlockchain}
                      onChange={(e) => setEnableBlockchain(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="blockchain" className="font-medium text-gray-700">Enable Blockchain Verification</label>
                    <p className="text-gray-500">Record votes on the Ethereum blockchain for maximum security and transparency</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
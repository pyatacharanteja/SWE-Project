'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isAdmin } = useAuth();
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  /*useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/vote');
      }
    }
  }, [isLoggedIn, isAdmin, router]);*/

  // Set default credentials based on selected login type
  useEffect(() => {
    if (loginType === 'admin') {
      setEmail('IITISM');
    } else {
      setEmail('test@gmail.com');
    }
    setPassword('');
  }, [loginType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (loginType === 'admin') {
        // Admin login logic
        if (email === 'IITISM' && password === 'IITISM') {
          console.log('Admin login successful');
          // Call login function from context which will handle redirection
          login(true);
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        // User login logic
        if (email === 'test@gmail.com' && password === 'IITISM') {
          console.log('User login successful');
          // Call login function from context which will handle redirection
          login(false);
        } else {
          setError('Invalid user credentials');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        {/* Login Type Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              type="button"
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                loginType === 'user'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLoginType('user')}
            >
              Voter
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                loginType === 'admin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLoginType('admin')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block p-3 rounded-full bg-indigo-100 mb-4">
            <span className="text-2xl">{loginType === 'admin' ? '👑' : '🗳️'}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {loginType === 'admin' ? 'Admin Login' : 'User Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {loginType === 'admin' 
              ? 'Access the admin dashboard to manage polls and view results'
              : 'Cast your vote securely and anonymously'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {loginType === 'admin' ? 'Username' : 'Email address'}
              </label>
              <input
                id="email"
                name="email"
                type={loginType === 'admin' ? "text" : "email"}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={loginType === 'admin' ? "Enter username" : "Enter email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                loginType === 'admin' 
                  ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              Sign in
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md" style={{ display: 'none' }}>
            <p className="font-medium mb-1">Demo Credentials</p>
            <p>
              {loginType === 'admin' 
                ? 'Username: IITISM, Password: IITISM'
                : 'Email: test@gmail.com, Password: IITISM'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
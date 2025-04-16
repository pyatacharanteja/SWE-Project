'use client';

import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

export function AuthDebug() {
  // Return null to hide the debug component completely
  return null;
  
  // Original debug code is kept but never executed
  const { isLoggedIn, isAdmin } = useAuth();

  const cookieLoggedIn = Cookies.get('isLoggedIn');
  const cookieAdmin = Cookies.get('isAdmin');
  const localLoggedIn = localStorage.getItem('isLoggedIn');
  const localAdmin = localStorage.getItem('isAdmin');

  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-4 text-xs opacity-70 z-50">
      <h4 className="font-bold">Auth Debug</h4>
      <div>Context: {isLoggedIn ? 'Logged In' : 'Not Logged In'}</div>
      <div>Role: {isAdmin ? 'Admin' : 'User'}</div>
      <div>Cookie isLoggedIn: {cookieLoggedIn || 'not set'}</div>
      <div>Cookie isAdmin: {cookieAdmin || 'not set'}</div>
      <div>LocalStorage isLoggedIn: {localLoggedIn || 'not set'}</div>
      <div>LocalStorage isAdmin: {localAdmin || 'not set'}</div>
    </div>
  );
} 
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const loggedIn = Cookies.get('isLoggedIn') === 'true';
    const adminStatus = Cookies.get('isAdmin') === 'true';
    
    console.log('Auth state from cookies:', { loggedIn, adminStatus });
    
    setIsLoggedIn(loggedIn);
    setIsAdmin(adminStatus);
  }, []);

  const login = (adminStatus: boolean) => {
    console.log('Login called with admin status:', adminStatus);
    
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    
    // Set cookies with a 7-day expiry and path set to root
    Cookies.set('isLoggedIn', 'true', { 
      expires: 7,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    Cookies.set('isAdmin', adminStatus.toString(), { 
      expires: 7,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Also set in localStorage as backup
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', adminStatus.toString());
    
    console.log('Login complete, state updated');
    
    // Redirect to welcome page instead of dashboard/vote
    setTimeout(() => {
      router.push('/welcome');
    }, 100);
  };

  const logout = () => {
    console.log('Logout called');
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // Clear cookies
    Cookies.remove('isLoggedIn', { path: '/' });
    Cookies.remove('isAdmin', { path: '/' });
    
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    
    router.push('/login');
  };

  const contextValue = {
    isLoggedIn,
    isAdmin,
    login,
    logout
  };

  console.log('Current auth state:', { isLoggedIn, isAdmin });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
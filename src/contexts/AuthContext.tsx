// src/contexts/AuthContext.tsx
'use client';

import type { ReactNode, FC } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Handle error (e.g., show a toast message)
    } finally {
      // setLoading(false); // onAuthStateChanged handles this
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error
    } finally {
      // setLoading(false); // onAuthStateChanged handles this
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

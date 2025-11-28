// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  Auth
} from 'firebase/auth';
import { auth } from '../firebase'; 

interface AuthContextType {
  currentUser: User | null | undefined;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined); 
  
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth as Auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth as Auth, email, password);
  };

  const logout = () => {
    return signOut(auth as Auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {currentUser !== undefined && children}
    </AuthContext.Provider>
  );
};
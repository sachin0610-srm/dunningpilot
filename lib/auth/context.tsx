'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: 'google' | 'demo';
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  demoSignIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for active demo user or Supabase session
    const checkSession = async () => {
      try {
        const storedDemoUser = localStorage.getItem('dunningpilot_demo_user');
        if (storedDemoUser) {
          setUser(JSON.parse(storedDemoUser));
          setIsLoading(false);
          return;
        }

        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'user@example.com',
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url,
              provider: 'google'
            });
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || 'user@example.com',
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url,
                provider: 'google'
              });
            } else if (!localStorage.getItem('dunningpilot_demo_user')) {
              setUser(null);
            }
          });

          return () => subscription.unsubscribe();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signInWithGoogle = async () => {
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
    } else {
      // Fallback demo sign in if Supabase URL is not configured yet
      demoSignIn();
    }
  };

  const demoSignIn = () => {
    const demoUser: UserSession = {
      id: 'usr_demo_88',
      email: 'alex.engineer@fintechcorp.io',
      name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'demo'
    };
    setUser(demoUser);
    localStorage.setItem('dunningpilot_demo_user', JSON.stringify(demoUser));
  };

  const signOut = async () => {
    localStorage.removeItem('dunningpilot_demo_user');
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, demoSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthRateLimit } from '@/services/security/authRateLimit';
import { SecurityAudit } from '@/services/security/securityAudit';
import { InputValidator } from '@/services/security/inputValidation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; phone_number?: string; location?: string }) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }

      toast.success('Check your email for verification link');
      return {};
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message);
      return { error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate input
      const emailValidation = InputValidator.validateEmail(email);
      if (!emailValidation.valid) {
        toast.error(emailValidation.error);
        return { error: emailValidation.error };
      }

      // Check rate limiting
      const rateLimitCheck = await AuthRateLimit.checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        const message = rateLimitCheck.blockedUntil 
          ? `Too many failed attempts. Try again after ${rateLimitCheck.blockedUntil.toLocaleTimeString()}`
          : 'Too many failed attempts. Please try again later.';
        toast.error(message);
        return { error: message };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Record the attempt
      await AuthRateLimit.recordAttempt(email, !error);

      if (error) {
        await SecurityAudit.logEvent('failed_login', {
          attemptedEmail: email,
          error: error.message
        });
        toast.error(error.message);
        return { error: error.message };
      }

      await SecurityAudit.logEvent('successful_login', {
        email: email
      });
      toast.success('Welcome back!');
      return {};
    } catch (error) {
      const message = (error as Error).message;
      await SecurityAudit.logEvent('failed_login', {
        attemptedEmail: email,
        error: message
      });
      toast.error(message);
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const updateProfile = async (updates: { full_name?: string; phone_number?: string; location?: string }) => {
    try {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }

      toast.success('Profile updated successfully');
      return {};
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message);
      return { error: message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
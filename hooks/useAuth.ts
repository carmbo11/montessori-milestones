import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isEmailWhitelisted } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

interface AuthActions {
  signIn: (email: string) => Promise<{ error: string | null; success: boolean }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string): Promise<{ error: string | null; success: boolean }> => {
    // Check whitelist before sending magic link
    if (!isEmailWhitelisted(email)) {
      return { error: 'Email not authorized for admin access.', success: false };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { error: null, success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // User is admin only if authenticated AND email is whitelisted
  const isAdmin = Boolean(
    user?.email && isEmailWhitelisted(user.email)
  );

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
  };
}

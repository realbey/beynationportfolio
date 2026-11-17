import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [checking, setChecking] = useState(false);

  // The database decides who is an admin (admin_users table + RLS).
  // This client-side flag only controls which screens are shown.
  const checkAdmin = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    setIsAdmin(!error && !!data);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await checkAdmin(data.session && data.session.user ? data.session.user.id : null);
      if (mounted) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Do not call Supabase inside this callback directly (can deadlock); defer it.
      setTimeout(() => {
        checkAdmin(newSession && newSession.user ? newSession.user.id : null);
      }, 0);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { error: new Error('Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      session,
      user: session ? session.user : null,
      isAdmin,
      loading: loading || checking,
      signIn,
      signOut,
    }),
    [session, isAdmin, loading, checking, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

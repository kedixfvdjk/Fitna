import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import { useGameStore } from '@/store/gameStore';

interface AuthState {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  initialize: () => () => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  loading: false,
  error: null,

  /**
   * Loads the persisted session (if any) and subscribes to future auth
   * changes. Returns an unsubscribe function for use in a useEffect cleanup.
   */
  initialize: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, initialized: true });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, initialized: true });
    });

    return () => listener.subscription.unsubscribe();
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
    set({ loading: false });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
    set({ loading: false });
  },

  signOut: async () => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
    set({ loading: false, session: null, user: null });
    useGameStore.getState().reset();
  },

  clearError: () => set({ error: null }),
}));

import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import type { Character } from '@/types/game';

/**
 * Single entry point that decides where a launching user should land:
 * login (no session), onboarding (session but no character yet), or the
 * main app (session + character). Keeping this decision in one place
 * avoids conflicting redirects between route groups.
 */
export default function Index() {
  const session = useAuthStore((state) => state.session);
  const authInitialized = useAuthStore((state) => state.initialized);
  const setCharacter = useGameStore((state) => state.setCharacter);
  const character = useGameStore((state) => state.character);

  const [checkingCharacter, setCheckingCharacter] = useState(true);

  useEffect(() => {
    if (!authInitialized || !session) {
      setCheckingCharacter(false);
      return;
    }

    let cancelled = false;

    async function loadCharacter() {
      if (character && character.user_id !== session!.user.id) {
        setCharacter(null);
      }

      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', session!.user.id)
        .maybeSingle<Character>();

      if (cancelled) return;
      if (data) setCharacter(data);
      setCheckingCharacter(false);
    }

    loadCharacter();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, session, setCharacter]);

  if (!authInitialized || checkingCharacter) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!character) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}

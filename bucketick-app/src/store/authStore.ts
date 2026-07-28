import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { clearTokens, getAccessToken } from '../api/client';
import { usersApi } from '../api/endpoints';
import { queryClient, qk } from '../api/queryClient';

const ONBOARDED_KEY = 'bucketick:onboarded';

/**
 * Session state only. User data lives in the React Query cache (`useMe`);
 * this store just tracks whether we have a valid session and onboarding status.
 */
interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  hydrated: boolean;
  setAuthenticated: (value: boolean) => void;
  completeOnboarding: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasOnboarded: false,
  hydrated: false,

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  completeOnboarding: async () => {
    set({ hasOnboarded: true });
    try {
      await AsyncStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* best effort */
    }
  },

  bootstrap: async () => {
    let hasOnboarded = false;
    try {
      hasOnboarded = (await AsyncStorage.getItem(ONBOARDED_KEY)) === '1';
    } catch {
      /* ignore */
    }

    const token = await getAccessToken();
    if (token) {
      try {
        const user = await usersApi.me();
        queryClient.setQueryData(qk.me, user);
        set({ isAuthenticated: true, hasOnboarded, hydrated: true });
        return;
      } catch {
        await clearTokens();
      }
    }
    set({ isAuthenticated: false, hasOnboarded, hydrated: true });
  },
}));

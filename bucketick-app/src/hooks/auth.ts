import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, qk } from '../api/queryClient';
import { clearTokens, getRefreshToken, saveTokens } from '../api/client';
import { authApi, usersApi } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';
import type { BrandColor } from '../theme';
import type { User } from '../types';

/** Current user. Enabled only when a session exists. */
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: qk.me,
    queryFn: usersApi.me,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (res) => {
      await saveTokens(res.accessToken, res.refreshToken);
      queryClient.clear();
      queryClient.setQueryData(qk.me, res.user);
      setAuthenticated(true);
    },
  });
}

export function useSignup() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authApi.register(name, email, password),
    onSuccess: async (res) => {
      await saveTokens(res.accessToken, res.refreshToken);
      queryClient.clear();
      queryClient.setQueryData(qk.me, res.user);
      setAuthenticated(true);
    },
  });
}

export function useLogout() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: async () => {
      const refresh = await getRefreshToken();
      if (refresh) await authApi.logout(refresh).catch(() => {});
      await clearTokens();
    },
    onSettled: () => {
      setAuthenticated(false);
      queryClient.clear();
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (patch: { name?: string; bio?: string | null; avatarColor?: BrandColor; avatarUrl?: string | null }) =>
      usersApi.updateMe(patch),
    onSuccess: (user: User) => {
      queryClient.setQueryData(qk.me, user);
    },
  });
}

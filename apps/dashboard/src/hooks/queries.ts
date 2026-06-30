import { useQuery } from '@tanstack/react-query';
import apiClient from '@bucketick/api-client';

/** One thin hook per backend domain. All currently resolve stubbed mock data. */

export const useProfile = () =>
  useQuery({ queryKey: ['profile', 'me'], queryFn: () => apiClient.users.getMe() });

export const useAnalytics = () =>
  useQuery({ queryKey: ['analytics', 'overview'], queryFn: () => apiClient.analytics.overview() });

export const useMyLists = () =>
  useQuery({ queryKey: ['bucketLists', 'mine'], queryFn: () => apiClient.bucketLists.listMine() });

export const useExploreFeed = () =>
  useQuery({ queryKey: ['explore', 'feed'], queryFn: () => apiClient.explore.feed() });

export const useExploreMedia = () =>
  useQuery({ queryKey: ['explore', 'media'], queryFn: () => apiClient.explore.media() });

export const useStreak = () =>
  useQuery({ queryKey: ['streaks', 'mine'], queryFn: () => apiClient.streaks.mine() });

export const useConversations = () =>
  useQuery({
    queryKey: ['messages', 'conversations'],
    queryFn: () => apiClient.messages.conversations(),
  });

export const useMessageThread = (conversationId: string | null) =>
  useQuery({
    queryKey: ['messages', 'thread', conversationId],
    queryFn: () => apiClient.messages.thread(conversationId as string),
    enabled: !!conversationId,
  });

export const useFollowers = () =>
  useQuery({ queryKey: ['follows', 'followers'], queryFn: () => apiClient.follows.followers() });

export const useFollowing = () =>
  useQuery({ queryKey: ['follows', 'following'], queryFn: () => apiClient.follows.following() });

export const useTrendingLists = () =>
  useQuery({
    queryKey: ['explore', 'trendingLists'],
    queryFn: () => apiClient.explore.trendingLists(),
  });

export const useTrendingUsers = () =>
  useQuery({
    queryKey: ['explore', 'trendingUsers'],
    queryFn: () => apiClient.explore.trendingUsers(),
  });

export const useAchievements = () =>
  useQuery({
    queryKey: ['achievements', 'mine'],
    queryFn: () => apiClient.achievements.listMine(),
  });

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: () => apiClient.notifications.list() });

export const useSavedLists = () =>
  useQuery({ queryKey: ['saved'], queryFn: () => apiClient.saved.list() });

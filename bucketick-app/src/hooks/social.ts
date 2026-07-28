import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, qk } from '../api/queryClient';
import { followsApi, leaderboardApi, searchApi, usersApi } from '../api/endpoints';
import type { Connection, Paginated } from '../types';

export function useLeaderboard() {
  return useQuery({ queryKey: qk.leaderboard, queryFn: leaderboardApi.get });
}

export function useSearchUsers(q: string) {
  return useQuery({
    queryKey: qk.search(q),
    queryFn: () => searchApi.users(q),
    staleTime: 20_000,
  });
}

export function useUser(userId: string) {
  return useQuery({ queryKey: qk.user(userId), queryFn: () => usersApi.getUser(userId), enabled: !!userId });
}

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: qk.userPosts(userId),
    queryFn: ({ pageParam }) => usersApi.posts(userId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: Paginated<unknown>) => last.nextCursor ?? undefined,
    enabled: !!userId,
  });
}

type ConnectionKind = 'followers' | 'following' | 'suggestions';

export function useConnections(kind: ConnectionKind) {
  return useQuery<Connection[]>({
    queryKey: qk.connections('me', kind),
    queryFn: () => {
      if (kind === 'following') return followsApi.following();
      if (kind === 'suggestions') return followsApi.suggestions();
      return followsApi.followers();
    },
  });
}

/** Follow / unfollow a user, refreshing every surface that shows follow state. */
export function useFollow() {
  return useMutation({
    mutationFn: ({ userId, follow }: { userId: string; follow: boolean }) =>
      follow ? followsApi.follow(userId) : followsApi.unfollow(userId),
    onSuccess: (_res, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: qk.user(userId) });
      queryClient.invalidateQueries({ queryKey: qk.me });
      queryClient.invalidateQueries({ queryKey: qk.feed });
    },
  });
}

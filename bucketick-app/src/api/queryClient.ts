import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Central query-key registry so invalidations stay consistent across the app. */
export const qk = {
  me: ['me'] as const,
  lists: ['lists'] as const,
  listItems: (listId: string) => ['lists', listId, 'items'] as const,
  leaderboard: ['leaderboard'] as const,
  feed: ['feed'] as const,
  explore: ['explore'] as const,
  bookmarks: ['bookmarks'] as const,
  post: (id: string) => ['post', id] as const,
  postComments: (id: string) => ['post', id, 'comments'] as const,
  user: (id: string) => ['user', id] as const,
  userPosts: (id: string) => ['user', id, 'posts'] as const,
  search: (q: string) => ['search', q] as const,
  connections: (userId: string, kind: string) => ['connections', userId, kind] as const,
};

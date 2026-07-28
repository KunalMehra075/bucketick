import { useInfiniteQuery } from '@tanstack/react-query';
import { qk } from '../api/queryClient';
import { bookmarksApi, exploreApi, feedApi } from '../api/endpoints';
import type { ExploreItem, Paginated, Post } from '../types';

const nextPage = (last: Paginated<unknown>) => last.nextCursor ?? undefined;

export function useFeed() {
  return useInfiniteQuery({
    queryKey: qk.feed,
    queryFn: ({ pageParam }) => feedApi.get(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: nextPage,
  });
}

export function useExplore() {
  return useInfiniteQuery({
    queryKey: qk.explore,
    queryFn: ({ pageParam }) => exploreApi.get(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: nextPage,
  });
}

export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: qk.bookmarks,
    queryFn: ({ pageParam }) => bookmarksApi.list(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: nextPage,
  });
}

/** Flatten infinite pages into a single item array. */
export function flattenPages<T>(data: { pages: Paginated<T>[] } | undefined): T[] {
  return data?.pages.flatMap((p) => p.items) ?? [];
}

export type { ExploreItem, Post };

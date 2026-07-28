import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, qk } from '../api/queryClient';
import { CreatePostInput, postsApi } from '../api/endpoints';
import type { Paginated } from '../types';

export function usePost(id: string) {
  return useQuery({ queryKey: qk.post(id), queryFn: () => postsApi.get(id), enabled: !!id });
}

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: qk.postComments(postId),
    queryFn: ({ pageParam }) => postsApi.comments(postId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: Paginated<unknown>) => last.nextCursor ?? undefined,
    enabled: !!postId,
  });
}

/** Invalidate every surface a new/changed post can appear on. */
function invalidatePostSurfaces() {
  queryClient.invalidateQueries({ queryKey: qk.feed });
  queryClient.invalidateQueries({ queryKey: qk.explore });
  queryClient.invalidateQueries({ queryKey: qk.me });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsApi.create(input),
    onSuccess: () => invalidatePostSurfaces(),
  });
}

export function useAddComment(postId: string) {
  return useMutation({
    mutationFn: (body: string) => postsApi.addComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.postComments(postId) });
      queryClient.invalidateQueries({ queryKey: qk.post(postId) });
      queryClient.invalidateQueries({ queryKey: qk.feed });
    },
  });
}

/**
 * Hype / unhype. The PostCard drives optimistic UI locally (instant), so these
 * mutations just call the API and refresh the detail cache on settle.
 */
export function useHype(postId: string) {
  return useMutation({
    mutationFn: (hyped: boolean) => (hyped ? postsApi.hype(postId) : postsApi.unhype(postId)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.post(postId) }),
  });
}

export function useBookmark(postId: string) {
  return useMutation({
    mutationFn: (bookmarked: boolean) =>
      bookmarked ? postsApi.bookmark(postId) : postsApi.unbookmark(postId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk.post(postId) });
      queryClient.invalidateQueries({ queryKey: qk.bookmarks });
    },
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: (id: string) => postsApi.remove(id),
    onSuccess: () => invalidatePostSurfaces(),
  });
}

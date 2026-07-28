import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, qk } from '../api/queryClient';
import { CreateListInput, itemsApi, listsApi } from '../api/endpoints';
import type { BucketItem, BucketList, ItemStatus } from '../types';

export function useLists() {
  return useQuery({ queryKey: qk.lists, queryFn: listsApi.list });
}

export function useListItems(listId: string) {
  return useQuery({
    queryKey: qk.listItems(listId),
    queryFn: () => listsApi.items(listId),
    enabled: !!listId,
  });
}

/** Overall totals for the home/lists hero, summed from list summaries. */
export function overallStats(lists: BucketList[] | undefined) {
  return (lists ?? []).reduce(
    (acc, l) => ({
      total: acc.total + l.itemsCount,
      done: acc.done + l.completedCount,
      active: acc.active + l.inProgressCount,
    }),
    { total: 0, done: 0, active: 0 }
  );
}

const invalidateLists = () => queryClient.invalidateQueries({ queryKey: qk.lists });

export function useCreateList() {
  return useMutation({
    mutationFn: (input: CreateListInput) => listsApi.create(input),
    onSuccess: invalidateLists,
  });
}

export function useUpdateList() {
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<CreateListInput> }) =>
      listsApi.update(id, patch),
    onSuccess: invalidateLists,
  });
}

export function useDeleteList() {
  return useMutation({
    mutationFn: (id: string) => listsApi.remove(id),
    onSuccess: invalidateLists,
  });
}

export function useAddItem(listId: string) {
  return useMutation({
    mutationFn: (input: { title: string; note?: string; location?: string }) =>
      listsApi.addItem(listId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.listItems(listId) });
      invalidateLists();
    },
  });
}

export function useUpdateItem(listId: string) {
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { title?: string; note?: string | null; location?: string | null } }) =>
      itemsApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.listItems(listId) }),
  });
}

export function useSetItemStatus(listId: string) {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ItemStatus }) =>
      itemsApi.update(id, { status }),
    // Optimistically flip the item in the cached items list.
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: qk.listItems(listId) });
      const prev = queryClient.getQueryData<BucketItem[]>(qk.listItems(listId));
      if (prev) {
        queryClient.setQueryData<BucketItem[]>(
          qk.listItems(listId),
          prev.map((i) =>
            i.id === id
              ? { ...i, status, completedAt: status === 'completed' ? new Date().toISOString() : null }
              : i
          )
        );
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(qk.listItems(listId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk.listItems(listId) });
      invalidateLists();
    },
  });
}

export function useDeleteItem(listId: string) {
  return useMutation({
    mutationFn: (id: string) => itemsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.listItems(listId) });
      invalidateLists();
    },
  });
}

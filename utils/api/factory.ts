import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { get, patch, post, remove, revalidate, UpdatePayload } from ".";

export const Paths = {
  Games: "/games",
  Users: "/users",
  Memberships: "/memberships",
  MenuCategories: "/menu/categories",
  MenuItems: "/menu/items",
  AllUsers: "/users?all=true",
  Location: "/location",
};

// This map is for revalidating server side page rendering.
// Whenever any mutation is triggered for paths in key values, we need to rerender each page in value array
export const revalidationMap = {
  [Paths.Users]: ["/1", "/2", "/gameplays", "/users"],
  [Paths.Games]: ["/1", "/2", "/gameplays", "/games"],
  [Paths.Memberships]: ["/memberships"],
  [Paths.MenuCategories]: ["/menu"],
  [Paths.MenuItems]: ["/menu"],
};

export function fetchItems<T extends { _id: number | string }>(
  path: string
): Promise<T[]> {
  return get<T[]>({
    path,
  });
}

export async function dehydratedState(paths: string[]) {
  const queryClient = new QueryClient();
  await Promise.all(
    paths.map((path) => queryClient.prefetchQuery(path, () => fetchItems(path)))
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

interface Props<T> {
  baseQuery: string;
  fetchQuery?: string;
  needsRevalidate?: boolean;
  sortFunction?: (a: Partial<T>, b: Partial<T>) => number;
}

export function useGetItems<T extends { _id: number | string }>(
  fetchQuery: string,
  stale: boolean = true
) {
  const { data } = useQuery(fetchQuery, () => fetchItems<T>(fetchQuery), {
    staleTime: stale ? 0 : Infinity,
  });
  return data || [];
}

export function useMutationApi<T extends { _id: number | string }>({
  baseQuery,
  fetchQuery = baseQuery,
  needsRevalidate = true,
  sortFunction,
}: Props<T>) {
  function createRequest(itemDetails: Partial<T>): Promise<T> {
    return post<Partial<T>, T>({
      path: baseQuery,
      payload: itemDetails,
    });
  }

  function deleteRequest(id: number): Promise<T> {
    return remove<T>({
      path: `${baseQuery}/${id}`,
    });
  }

  function updateRequest({ id, updates }: UpdatePayload<T>): Promise<T> {
    return patch<Partial<T>, T>({
      path: `${baseQuery}/${id}`,
      payload: updates,
    });
  }

  function useCreateItemMutation() {
    const queryClient = useQueryClient();
    return useMutation(createRequest, {
      // We are updating tables query data with new item
      onMutate: async (itemDetails) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(fetchQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(fetchQuery);

        const updatedItems = [...(previousItems as T[]), itemDetails];
        if (sortFunction) {
          updatedItems.sort(sortFunction);
        }

        // Optimistically update to the new value
        queryClient.setQueryData(fetchQuery, updatedItems);

        // Return a context object with the snapshotted value
        return { previousItems };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newTable, context) => {
        const previousItemContext = context as {
          previousItems: T[];
        };
        if (previousItemContext?.previousItems) {
          const { previousItems } = previousItemContext;
          queryClient.setQueryData<T[]>(fetchQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: async () => {
        if (needsRevalidate) {
          await revalidate(revalidationMap[baseQuery]);
        }
        queryClient.invalidateQueries(fetchQuery);
      },
    });
  }
  function useDeleteItemMutation() {
    const queryClient = useQueryClient();

    return useMutation(deleteRequest, {
      // We are updating tables query data with new item
      onMutate: async (id) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(fetchQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(fetchQuery) || [];

        const updatedItems = previousItems.filter((item) => item._id !== id);
        if (sortFunction) {
          updatedItems.sort(sortFunction);
        }

        // Optimistically update to the new value
        queryClient.setQueryData(fetchQuery, updatedItems);

        // Return a context object with the snapshotted value
        return { previousItems };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newTable, context) => {
        const previousItemContext = context as {
          previousItems: T[];
        };
        if (previousItemContext?.previousItems) {
          const { previousItems } = previousItemContext;
          queryClient.setQueryData<T[]>(fetchQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: async () => {
        if (needsRevalidate) {
          await revalidate(revalidationMap[baseQuery]);
        }
        queryClient.invalidateQueries(fetchQuery);
      },
    });
  }
  function useUpdateItemMutation() {
    const queryClient = useQueryClient();
    return useMutation(updateRequest, {
      // We are updating tables query data with new item
      onMutate: async ({ id, updates }: UpdatePayload<T>) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(fetchQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(fetchQuery) || [];

        const updatedItems = [...previousItems];

        for (let i = 0; i < updatedItems.length; i++) {
          if (updatedItems[i]._id === id) {
            updatedItems[i] = { ...updatedItems[i], ...updates };
          }
        }

        if (sortFunction) {
          updatedItems.sort(sortFunction);
        }

        // Optimistically update to the new value
        queryClient.setQueryData(fetchQuery, updatedItems);

        // Return a context object with the snapshotted value
        return { previousItems };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newTable, context) => {
        const previousItemContext = context as {
          previousItems: T[];
        };
        if (previousItemContext?.previousItems) {
          const { previousItems } = previousItemContext;
          queryClient.setQueryData<T[]>(fetchQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: async () => {
        if (needsRevalidate) {
          await revalidate(revalidationMap[baseQuery]);
        }
        queryClient.invalidateQueries(fetchQuery);
      },
    });
  }

  const { mutate: deleteItem } = useDeleteItemMutation();
  const { mutate: updateItem } = useUpdateItemMutation();
  const { mutate: createItem } = useCreateItemMutation();

  return {
    deleteItem,
    updateItem,
    createItem,
  };
}

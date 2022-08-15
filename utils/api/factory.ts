import { GetServerSidePropsContext } from "next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { get, patch, post, remove, UpdatePayload } from ".";

export function generateServerSideApi<T extends { _id: number }>(
  query: string
) {
  function getItems(context: GetServerSidePropsContext): Promise<T[]> {
    return get<T[]>({
      path: query,
      context,
    });
  }
  return {
    getItems,
  };
}

interface Props<T> {
  baseQuery: string;
  initialItems?: T[];
}

export function useGenerateApi<T extends { _id: number }>({
  baseQuery,
  initialItems = [],
}: Props<T>) {
  function getItems(): Promise<T[]> {
    return get<T[]>({
      path: baseQuery,
    });
  }

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

  function useGetItems(initialItems: T[]) {
    const { isLoading, error, data, isFetching } = useQuery(
      baseQuery,
      () => getItems(),
      {
        initialData: initialItems,
      }
    );
    return {
      isLoading,
      error,
      items: data,
      isFetching,
    };
  }

  function useCreateItemMutation() {
    const queryClient = useQueryClient();
    return useMutation(createRequest, {
      // We are updating tables query data with new item
      onMutate: async (itemDetails) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(baseQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(baseQuery);

        const updatedItems = [...(previousItems as T[]), itemDetails];

        // Optimistically update to the new value
        queryClient.setQueryData(baseQuery, updatedItems);

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
          queryClient.setQueryData<T[]>(baseQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(baseQuery);
      },
    });
  }
  function useDeleteItemMutation() {
    const queryClient = useQueryClient();

    return useMutation(deleteRequest, {
      // We are updating tables query data with new item
      onMutate: async (id) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(baseQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(baseQuery) || [];

        const updatedItems = previousItems.filter((item) => item._id !== id);

        // Optimistically update to the new value
        queryClient.setQueryData(baseQuery, updatedItems);

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
          queryClient.setQueryData<T[]>(baseQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(baseQuery);
      },
    });
  }
  function useUpdateItemMutation() {
    const queryClient = useQueryClient();
    return useMutation(updateRequest, {
      // We are updating tables query data with new item
      onMutate: async ({ id, updates }: UpdatePayload<T>) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(baseQuery);

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<T[]>(baseQuery) || [];

        const updatedItems = [...previousItems];

        for (let i = 0; i < updatedItems.length; i++) {
          if (updatedItems[i]._id === id) {
            updatedItems[i] = { ...updatedItems[i], ...updates };
          }
        }

        // Optimistically update to the new value
        queryClient.setQueryData(baseQuery, updatedItems);

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
          queryClient.setQueryData<T[]>(baseQuery, previousItems);
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(baseQuery);
      },
    });
  }

  const { items } = useGetItems(initialItems);
  const { mutate: deleteItem } = useDeleteItemMutation();
  const { mutate: updateItem } = useUpdateItemMutation();
  const { mutate: createItem } = useCreateItemMutation();

  return {
    items: items || [],
    deleteItem,
    updateItem,
    createItem,
  };
}

import { GetServerSidePropsContext } from "next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { get, patch, post, remove, UpdatePayload } from ".";
import { PossibleContext } from "../token";

interface Props<T> {
  baseQuery: string;
}

export function generateServerSideApi<T extends { _id: number }>({
  baseQuery,
}: Props<T>) {
  function getItems(context: GetServerSidePropsContext): Promise<T[]> {
    return get<T[]>({
      path: baseQuery,
      context,
    });
  }
  return {
    getItems,
  };
}

export function generateApi<T extends { _id: number }>({
  baseQuery,
}: Props<T>) {
  function getItems(): Promise<T[]> {
    return get<T[]>({
      path: baseQuery,
    });
  }

  function createItem(itemDetails: Partial<T>): Promise<T> {
    return post<Partial<T>, T>({
      path: baseQuery,
      payload: itemDetails,
    });
  }

  function deleteItem(id: number): Promise<T> {
    return remove<T>({
      path: `${baseQuery}/${id}`,
    });
  }

  function updateItem({ id, updates }: UpdatePayload<T>): Promise<T> {
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
    return useMutation(createItem, {
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

    return useMutation(deleteItem, {
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
    return useMutation(updateItem, {
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

  return {
    useGetItems,
    useCreateItemMutation,
    useDeleteItemMutation,
    useUpdateItemMutation,
  };
}

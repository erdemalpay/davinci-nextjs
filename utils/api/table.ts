import { get, post } from "./index";
import { Table } from "../../types/index";
import { PossibleContext } from "../serverUtils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";

interface TableCreateRequest {
  payload: Table;
}

// This is only called on server side in ServerSideProps
export function getTables({ context }: PossibleContext): Promise<Table[]> {
  const location = Number(context?.params?.location);
  return get<Table[]>({ path: `/tables/all?location=${location}`, context });
}

// Client side access tables using this helper method
export function useGetTables(initialTables: Table[]) {
  const { selectedLocation } = useContext(LocationContext);
  const query = `/tables/all?location=${selectedLocation?._id}`;

  const { isLoading, error, data, isFetching } = useQuery(
    query,
    () => get<Table[]>({ path: query }),
    {
      initialData: initialTables,
    }
  );
  return {
    isLoading,
    error,
    tables: data,
    isFetching,
  };
}

export function createTable({ payload }: TableCreateRequest): Promise<Table> {
  return post<Table, Table>({
    path: `/tables/new`,
    payload,
  });
}

export function useCreateTableMutation() {
  const { selectedLocation } = useContext(LocationContext);
  const tablesQuery = `/tables/all?location=${selectedLocation?._id}`;
  const queryClient = useQueryClient();
  return useMutation(createTable, {
    // We are updating tables query data with new table
    onMutate: async (newTable) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables = queryClient.getQueryData<Table[]>(tablesQuery);

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, [
        ...(previousTables as Table[]),
        newTable,
      ]);

      // Return a context object with the snapshotted value
      return { previousTables };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousTableContext = context as { previousTables: Table[] };
      if (previousTableContext?.previousTables) {
        const { previousTables } = previousTableContext;
        queryClient.setQueryData<Table[]>(tablesQuery, previousTables);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(tablesQuery);
    },
  });
}

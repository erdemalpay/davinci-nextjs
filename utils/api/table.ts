import { format } from "date-fns";
import { get, patch, post, remove } from "./index";
import { Table } from "../../types/index";
import { PossibleContext } from "../token";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext } from "react";
import { SelectedDateContext } from "../../context/SelectedDateContext";
import { sortTable } from "../sort";
import { useLocation } from "../../hooks/useLocation";
import { LocationContext } from "../../context/LocationContext";

interface UpdateTablePayload {
  id: number;
  updates: Partial<Table>;
}

interface DeleteTablePayload {
  id: number;
}

// This is only called on server side in ServerSideProps
export function getTables({ context }: PossibleContext): Promise<Table[]> {
  const location = Number(context?.params?.location);
  return get<Table[]>({
    path: `/tables?location=${location}&date=${format(
      new Date(),
      "yyyy-MM-dd"
    )}`,
    context,
  });
}

// Client side access tables using this helper method
export function useGetTables(initialTables: Table[]) {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const query = `/tables?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;

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

export function createTable(table: Table): Promise<Table> {
  return post<Table, Table>({
    path: `/tables`,
    payload: table,
  });
}

export function updateTable({
  id,
  updates,
}: UpdateTablePayload): Promise<Table> {
  return patch<Partial<Table>, Table>({
    path: `/tables/${id}`,
    payload: updates,
  });
}

export function closeTable({
  id,
  updates,
}: UpdateTablePayload): Promise<Table> {
  return patch<Partial<Table>, Table>({
    path: `/tables/close/${id}`,
    payload: updates,
  });
}

export function deleteTable({ id }: DeleteTablePayload): Promise<Table> {
  return remove<Table>({
    path: `/tables/${id}`,
  });
}

export function useCreateTableMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const queryClient = useQueryClient();

  const tablesQuery = `/tables?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  return useMutation(createTable, {
    // We are updating tables query data with new table
    onMutate: async (newTable) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables = queryClient.getQueryData<Table[]>(tablesQuery);

      const updatedTables = [...(previousTables as Table[]), newTable];
      updatedTables.sort(sortTable);

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, updatedTables);

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

export function useUpdateTableMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  const queryClient = useQueryClient();
  return useMutation(updateTable, {
    // We are updating tables query data with new table
    onMutate: async ({ id, updates }: UpdateTablePayload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables =
        queryClient.getQueryData<Table[]>(tablesQuery) || [];
      const updatedTables = [...previousTables];

      for (let i = 0; i < updatedTables.length; i++) {
        if (updatedTables[i]._id === id) {
          updatedTables[i] = { ...updatedTables[i], ...updates };
        }
      }
      updatedTables.sort(sortTable);

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, updatedTables);

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
export function useCloseTableMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  const queryClient = useQueryClient();
  return useMutation(closeTable, {
    // We are updating tables query data with new table
    onMutate: async ({ id, updates }: UpdateTablePayload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables =
        queryClient.getQueryData<Table[]>(tablesQuery) || [];
      const updatedTables = [...previousTables];

      for (let i = 0; i < updatedTables.length; i++) {
        if (updatedTables[i]._id === id) {
          updatedTables[i] = { ...updatedTables[i], ...updates };
        }
      }
      updatedTables.sort(sortTable);

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, updatedTables);

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

export function useDeleteTableMutation() {
  const { selectedLocationId } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables?location=${selectedLocationId}&date=${format(
    selectedDate!,
    "yyyy-MM-dd"
  )}`;
  const queryClient = useQueryClient();
  return useMutation(deleteTable, {
    // We are updating tables query data with new table
    onMutate: async ({ id }: DeleteTablePayload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables =
        queryClient.getQueryData<Table[]>(tablesQuery) || [];
      const updatedTables = previousTables.filter((table) => table._id !== id);

      updatedTables.sort(sortTable);

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, updatedTables);

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

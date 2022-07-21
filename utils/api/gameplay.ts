import { patch, post, remove } from "./index";
import { Gameplay, Table } from "../../types/index";
import { PossibleContext } from "../token";
import { useMutation, useQueryClient } from "react-query";
import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { SelectedDateContext } from "../../context/SelectedDateContext";
import { format } from "date-fns";

interface GameplayCreateRequest extends PossibleContext {
  table: number;
  payload: Gameplay;
}

interface UpdateGameplayPayload {
  tableId: number;
  id: number;
  updates: Partial<Gameplay>;
}

interface DeleteGameplayPayload {
  tableId: number;
  id: number;
}

export function createGameplay({
  table,
  payload,
}: GameplayCreateRequest): Promise<Gameplay> {
  return post<Gameplay, Gameplay>({
    path: `/tables/${table}/gameplay`,
    payload,
  });
}

export function updateGameplay({
  tableId,
  id,
  updates,
}: UpdateGameplayPayload): Promise<Gameplay> {
  return patch<Partial<Gameplay>, Gameplay>({
    path: `/gameplays/${id}`,
    payload: updates,
  });
}

export function deleteGameplay({
  tableId,
  id,
}: DeleteGameplayPayload): Promise<void> {
  return remove<void>({
    path: `/tables/${tableId}/gameplay/${id}`,
  });
}

export function useCreateGameplayMutation() {
  const { selectedLocation } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables/all?location=${
    selectedLocation?._id
  }&date=${format(selectedDate!, "yyyy-MM-dd")}`;
  const queryClient = useQueryClient();
  return useMutation(createGameplay, {
    // We are updating tables query data with updated gameplay
    onMutate: async (newGameplay) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables = queryClient.getQueryData<Table[]>(tablesQuery);
      const previousTable = previousTables?.find(
        (table) => table._id === newGameplay.table
      );
      if (!previousTable) return { previousTables };

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, [
        ...previousTables!.filter((table) => table._id !== previousTable._id),
        {
          ...previousTable,
          gameplays: [...previousTable!.gameplays, newGameplay.payload],
        },
      ]);

      // Return a context object with the snapshotted value
      return { previousTables };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newGameplay, context) => {
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

export function useUpdateGameplayMutation() {
  const { selectedLocation } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables/all?location=${
    selectedLocation?._id
  }&date=${format(selectedDate!, "yyyy-MM-dd")}`;
  const queryClient = useQueryClient();
  return useMutation(updateGameplay, {
    // We are updating tables query data with new gameplay
    onMutate: async ({ tableId, id, updates }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables = queryClient.getQueryData<Table[]>(tablesQuery);
      const gameplaysTable = previousTables?.find(
        (table) => table._id === tableId
      );
      if (!gameplaysTable) return { previousTables };
      const updatedGameplay = gameplaysTable.gameplays.find(
        (gameplay) => gameplay._id === id
      );

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, [
        ...previousTables!.filter((table) => table._id !== gameplaysTable._id),
        {
          ...gameplaysTable,
          gameplays: [
            ...gameplaysTable!.gameplays!.filter(
              (gameplay) => gameplay._id !== id
            ),
            {
              ...updatedGameplay,
              ...updates,
            },
          ],
        },
      ]);

      // Return a context object with the snapshotted value
      return { previousTables };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newGameplay, context) => {
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

export function useDeleteGameplayMutation() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables/all?location=${
    selectedLocation?._id
  }&date=${format(selectedDate!, "yyyy-MM-dd")}`;
  return useMutation(deleteGameplay, {
    // We are updating tables query data with delete gameplay
    onMutate: async ({ tableId, id }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(tablesQuery);

      // Snapshot the previous value
      const previousTables = queryClient.getQueryData<Table[]>(tablesQuery);
      const gameplaysTable = previousTables?.find(
        (table) => table._id === tableId
      );
      if (!gameplaysTable) return { previousTables };

      // Optimistically update to the new value
      queryClient.setQueryData(tablesQuery, [
        ...previousTables!.filter((table) => table._id !== gameplaysTable._id),
        {
          ...gameplaysTable,
          gameplays: [
            ...gameplaysTable!.gameplays!.filter(
              (gameplay) => gameplay._id !== id
            ),
          ],
        },
      ]);

      // Return a context object with the snapshotted value
      return { previousTables };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newGameplay, context) => {
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

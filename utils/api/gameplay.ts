import { post } from "./index";
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

export function createGameplay({
  table,
  payload,
}: GameplayCreateRequest): Promise<Gameplay> {
  return post<Gameplay, Gameplay>({
    path: `/tables/${table}/gameplay`,
    payload,
  });
}

export function useGameplayMutation() {
  const { selectedLocation } = useContext(LocationContext);
  const { selectedDate } = useContext(SelectedDateContext);
  const tablesQuery = `/tables/all?location=${
    selectedLocation?._id
  }&date=${format(selectedDate!, "yyyy-MM-dd")}`;
  const queryClient = useQueryClient();
  return useMutation(createGameplay, {
    // We are updating tables query data with new gameplay
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

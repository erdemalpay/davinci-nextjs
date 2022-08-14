import { Game } from "../../types";
import { get, patch, post, remove, UpdatePayload } from ".";
import { PossibleContext } from "../token";
import { useMutation, useQuery, useQueryClient } from "react-query";

const getAllGamesQuery = "/games";

export function getGames(params?: PossibleContext): Promise<Game[]> {
  return get<Game[]>({ path: getAllGamesQuery, context: params?.context });
}

export function createGame(gameDetails: Game): Promise<Game> {
  return post<Game, Game>({
    path: `/games`,
    payload: gameDetails,
  });
}

export function updateGame({
  id,
  updates,
}: UpdatePayload<Game>): Promise<Game> {
  return patch<Partial<Game>, Game>({
    path: `/games/${id}`,
    payload: updates,
  });
}

export function deleteGame(id: number): Promise<Game> {
  return remove<Game>({
    path: `/games/${id}`,
  });
}

export function useGetGames(initialGames: Game[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    getAllGamesQuery,
    () => getGames(),
    {
      initialData: initialGames,
    }
  );
  data?.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });
  return {
    isLoading,
    error,
    games: data,
    isFetching,
  };
}

export function useGetGameDetails(gameId: number) {
  const getGameDetailsQuery = `/games/details/${gameId}`;
  const { isLoading, error, data, isFetching } = useQuery(
    getGameDetailsQuery,
    () => get<Game>({ path: getGameDetailsQuery })
  );
  return {
    isLoading,
    error,
    gameDetails: data,
    isFetching,
  };
}

export function useCreateGameMutation() {
  const queryClient = useQueryClient();

  const gamesQuery = "/games";
  return useMutation(createGame, {
    // We are updating tables query data with new game
    onMutate: async (gameDetails) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(gamesQuery);

      // Snapshot the previous value
      const previousGames = queryClient.getQueryData<Game[]>(gamesQuery);

      const updatedGames = [...(previousGames as Game[]), gameDetails];

      // Optimistically update to the new value
      queryClient.setQueryData(gamesQuery, updatedGames);

      // Return a context object with the snapshotted value
      return { previousGames };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousGameContext = context as { previousGames: Game[] };
      if (previousGameContext?.previousGames) {
        const { previousGames } = previousGameContext;
        queryClient.setQueryData<Game[]>(gamesQuery, previousGames);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(gamesQuery);
    },
  });
}

export function useUpdateGameMutation() {
  const queryClient = useQueryClient();

  const gamesQuery = "/games";
  return useMutation(updateGame, {
    // We are updating tables query data with new Game
    onMutate: async ({ id, updates }: UpdatePayload<Game>) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(gamesQuery);

      // Snapshot the previous value
      const previousGames = queryClient.getQueryData<Game[]>(gamesQuery) || [];

      const updatedGames = [...previousGames];

      for (let i = 0; i < updatedGames.length; i++) {
        if (updatedGames[i]._id === id) {
          updatedGames[i] = { ...updatedGames[i], ...updates };
        }
      }

      // Optimistically update to the new value
      queryClient.setQueryData(gamesQuery, updatedGames);

      // Return a context object with the snapshotted value
      return { previousGames };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousGameContext = context as {
        previousGames: Game[];
      };
      if (previousGameContext?.previousGames) {
        const { previousGames } = previousGameContext;
        queryClient.setQueryData<Game[]>(gamesQuery, previousGames);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(gamesQuery);
    },
  });
}
export function useDeleteGameMutation() {
  const queryClient = useQueryClient();

  const gamesQuery = "/games";
  return useMutation(deleteGame, {
    // We are updating tables query data with new Game
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(gamesQuery);

      // Snapshot the previous value
      const previousGames = queryClient.getQueryData<Game[]>(gamesQuery) || [];

      const updatedGames = previousGames.filter((game) => game._id !== id);

      // Optimistically update to the new value
      queryClient.setQueryData(gamesQuery, updatedGames);

      // Return a context object with the snapshotted value
      return { previousGames };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newTable, context) => {
      const previousGameContext = context as {
        previousGames: Game[];
      };
      if (previousGameContext?.previousGames) {
        const { previousGames } = previousGameContext;
        queryClient.setQueryData<Game[]>(gamesQuery, previousGames);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(gamesQuery);
    },
  });
}

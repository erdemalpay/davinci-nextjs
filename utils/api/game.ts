import { Game } from "../../types";
import { get, post } from ".";
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

export function useGetGames(initialGames: Game[]) {
  const { isLoading, error, data, isFetching } = useQuery(
    getAllGamesQuery,
    () => getGames(),
    {
      initialData: initialGames,
    }
  );
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

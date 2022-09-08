import { Game } from "../../types";
import { get } from ".";
import { useQuery } from "react-query";
import { Paths, useGetItems, useMutationApi } from "./factory";

export function useGameMutations() {
  const {
    deleteItem: deleteGame,
    updateItem: updateGame,
    createItem: createGame,
  } = useMutationApi<Game>({
    baseQuery: Paths.Games,
  });

  return { deleteGame, updateGame, createGame };
}

export function useGetGames() {
  return useGetItems<Game>(Paths.Games, false);
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

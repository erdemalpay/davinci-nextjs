import { Game } from "../../types";
import { get } from ".";
import { useQuery } from "react-query";
import { useGenerateApi } from "./factory";

export function useGames(initialItems: Game[] = []) {
  const {
    items: games,
    deleteItem: deleteGame,
    updateItem: updateGame,
    createItem: createGame,
  } = useGenerateApi<Game>({
    baseQuery: "/games",
    initialItems,
  });

  games?.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return { games, deleteGame, updateGame, createGame };
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

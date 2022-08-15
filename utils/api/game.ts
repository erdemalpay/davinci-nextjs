import { Game } from "../../types";
import { get } from ".";
import { useQuery } from "react-query";

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

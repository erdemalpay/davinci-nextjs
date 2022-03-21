import { Game } from "../../types";
import { get } from ".";
import { PossibleContext } from "../serverUtils";
import { useQuery } from "react-query";

const getAllGamesQuery = "/games/all";

export function getGames(params?: PossibleContext): Promise<Game[]> {
  return get<Game[]>({ path: getAllGamesQuery, context: params?.context });
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

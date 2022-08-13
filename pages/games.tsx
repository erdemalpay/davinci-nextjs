import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import type { Game } from "../types";
import { getGames, useGetGames } from "../utils/api/game";
import { GameListItem } from "../components/GameListItem";
import { Pagination } from "../components/Pagination";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getGames({ context });
  return { props: { user } };
};

export default function Games({ games: initialGames }: { games: Game[] }) {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [gameLimitPerPage, setpageListLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const startIndex = (page - 1) * gameLimitPerPage;
  const { isLoading, error, games } = useGetGames(initialGames);
  const [gamesCount, setGamesCount] = useState(0);

  useEffect(() => {
    if (!games) return;
    setGamesCount(games?.length);
    setFilteredGames(games?.slice(startIndex, startIndex + gameLimitPerPage));
    setTotalPages(Math.ceil(gamesCount / gameLimitPerPage));
  }, [page, games, gamesCount, gameLimitPerPage, startIndex]);

  if (error) return <p>An error has occurred.</p>;
  if (isLoading) return <p>Loading...</p>;

  const handleClick = (num: number) => {
    if (num > 0 && num < totalPages + 1) setPage(num);
  };

  return (
    <div className="m-8">
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Expansion
              </th>
              <th scope="col" className="py-3 px-6">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <GameListItem game={game} key={game._id} />
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          startIndex={startIndex}
          gameLimitPerPage={gameLimitPerPage}
          gamesCount={gamesCount}
          totalPages={totalPages}
          handleClick={handleClick}
        ></Pagination>
      </div>
    </div>
  );
}

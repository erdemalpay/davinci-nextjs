/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import type { Game } from "../types";
import {
  getGames,
  useDeleteGameMutation,
  useGetGames,
  useUpdateGameMutation,
} from "../utils/api/game";
import { Pagination } from "../components/Pagination";
import { Switch } from "@headlessui/react";
import { Header } from "../components/Header";
import { toast } from "react-toastify";
import { EditableText } from "../components/EditableText";
import { CheckSwitch } from "../components/CheckSwitch";
import { AddGameDialog } from "../components/AddGameDialog";
import { TrashIcon } from "@heroicons/react/solid";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const games = await getGames({ context });
  games.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return { props: { games } };
};

export default function Games({ games: initialGames }: { games: Game[] }) {
  const [textFilter, setTextFilter] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [gamePerPage, setGamePerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { isLoading, error, games } = useGetGames(initialGames);
  const { mutate: deleteGame } = useDeleteGameMutation();
  const { mutate: updateGame } = useUpdateGameMutation();
  const [gamesCount, setGamesCount] = useState(0);
  const [showGameImages, setShowGameImages] = useState(false);
  const [isAddGameDialogOpen, setIsAddGameDialogOpen] = useState(false);

  useEffect(() => {
    if (!games) return;
    let filteredGames = games.filter((game) => {
      return game.name
        .replace("İ", "I")
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(textFilter.toLowerCase().replace(/\s+/g, ""));
    });
    setGamesCount(filteredGames.length);
    setFilteredGames(
      filteredGames.slice(gamePerPage * (page - 1), gamePerPage * page)
    );
    setTotalPages(Math.ceil(filteredGames.length / gamePerPage));
  }, [page, games, gamesCount, gamePerPage, textFilter]);

  if (error) return <p>An error has occurred.</p>;
  if (isLoading) return <p>Loading...</p>;

  const handleClick = (num: number) => {
    let newPage = num;
    if (num <= 0) newPage = 1;
    if (num > totalPages) newPage = totalPages;
    setPage(newPage);
  };

  function handleLimitSelection(value: number) {
    setGamePerPage(value);
    setPage(1);
  }

  function updateGameHandler(event: FormEvent<HTMLInputElement>, item?: Game) {
    if (!item) return;
    const target = event.target as HTMLInputElement;
    console.log({ value: target.value });
    if (!target.value) return;
    updateGame({
      id: item._id,
      updates: { [target.name]: target.value },
    });
    toast.success(
      `Game ${target.name === "name" ? target.value : item.name} updated`
    );
  }

  /* function handleSetExpansion(game: Game) {
    updateGame({
      id: game._id,
      updates: { expansion: !game.expansion },
    });
    toast.success(`Game ${game.name} updated`);
  } */

  function handleLocationUpdate(game: Game, location: number) {
    let newLocations = game.locations || [];
    // Add if it doesn't exist, remove otherwise
    const index = newLocations.indexOf(location);
    if (index === -1) {
      newLocations.push(location);
    } else {
      newLocations.splice(index, 1);
    }
    updateGame({
      id: game._id,
      updates: { locations: newLocations },
    });
    toast.success(`Game ${game.name} updated`);
  }

  return (
    <>
      <Header showLocationSelector={false} />
      <div className="mx-2 lg:mx-20 my:2 lg:my-10">
        <div className="overflow-x-auto sm:rounded-lg">
          <Pagination
            page={page}
            limitPerPage={gamePerPage}
            itemsCount={gamesCount}
            totalPages={totalPages}
            handleClick={handleClick}
            handleLimitSelection={handleLimitSelection}
          ></Pagination>
          <div className="flex flex-col-reverse lg:flex-row justify-between gap-4 items-center mb-4">
            <div className="flex justify-end gap-4 items-center">
              <input
                type="text"
                id="table-search"
                className="block p-2 ml-4 pl-4 w-80 text-sm text-gray-900 rounded-lg border border-gray-300"
                placeholder="Search for games"
                value={textFilter}
                onChange={(event) => setTextFilter(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 items-center">
              <h1 className="text-md">Show Game Covers</h1>
              <Switch
                checked={showGameImages}
                onChange={() => setShowGameImages((value) => !value)}
                className={`${showGameImages ? "bg-green-500" : "bg-red-500"}
              relative inline-flex h-[20px] w-[36px] border-[1px] cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
              >
                <span
                  className={`${
                    showGameImages ? "translate-x-4" : "translate-x-0"
                  }
                pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </Switch>
              <button
                onClick={() => setIsAddGameDialogOpen(true)}
                className="py-2 bg-white transition duration-150 ease-in-out hover:border-gray-900 hover:text-gray-900 rounded border border-gray-800 text-gray-800 px-2 lg:px-6 text-sm"
              >
                Add New Game
              </button>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className={`${showGameImages ? "block" : "hidden"} py-3 px-6`}
                >
                  Image
                </th>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                {/* <th scope="col" className="py-3 px-6">
                  Expansion
                </th> */}
                <th scope="col" className="py-3 px-6">
                  Bahçeli
                </th>
                <th scope="col" className="py-3 px-6">
                  Neorama
                </th>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr
                  key={game._id}
                  className="bg-w hite border-b hover:bg-gray-100"
                >
                  <td
                    className={`${
                      showGameImages ? "block" : "hidden"
                    } py-2 px-2 lg:px-6`}
                  >
                    <img src={game.thumbnail} alt={game.name} />
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-2 lg:px-6 font-medium text-gray-900 lg:whitespace-nowrap"
                  >
                    <EditableText
                      text={game.name}
                      onUpdate={updateGameHandler}
                      name="name"
                      item={game}
                    ></EditableText>
                  </td>
                  {/* <td className="py-2 px-6">
                    <CheckSwitch
                      checked={game.expansion}
                      onChange={() => handleSetExpansion(game)}
                    ></CheckSwitch>
                  </td> */}
                  <td className="py-2 px-2 lg:px-6">
                    <CheckSwitch
                      checked={game.locations?.includes(1)}
                      onChange={() => handleLocationUpdate(game, 1)}
                    ></CheckSwitch>
                  </td>
                  <td className="py-2 px-2 lg:px-6">
                    <CheckSwitch
                      checked={game.locations?.includes(2)}
                      onChange={() => handleLocationUpdate(game, 2)}
                    ></CheckSwitch>
                  </td>
                  <td className="py-2 px-2 lg:px-6">
                    <button onClick={() => deleteGame(game._id)}>
                      <TrashIcon className="text-red-500 w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isAddGameDialogOpen && (
        <AddGameDialog
          isOpen={isAddGameDialogOpen}
          close={() => setIsAddGameDialogOpen(false)}
        />
      )}
    </>
  );
}

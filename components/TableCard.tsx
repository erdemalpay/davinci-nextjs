import { PlusIcon, PencilIcon, FlagIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { Gameplay, Table, User, Game } from "../types";
import { GameplayDialog } from "./GameplayDialog";
import { InputWithLabel } from "./InputWithLabel";
import { CardAction } from "./CardAction";
import { format } from "date-fns";

export interface TableCardProps {
  table: Table;
  mentors: User[];
  games: Game[];
}

export function TableCard({ table, mentors, games }: TableCardProps) {
  const [isGameplayDialogOpen, setIsGameplayDialogOpen] = useState(false);
  const [selectedGameplay, setSelectedGameplay] = useState<Gameplay>();

  function createGameplay() {
    setSelectedGameplay(undefined);
    setIsGameplayDialogOpen(true);
  }

  function getGameName(id: number) {
    const game = games.find((game) => game._id === id);
    return game?.name || "";
  }

  function finishTable() {
    // setSelectedGameplay(undefined);
    // setIsGameplayDialogOpen(true);
  }

  const date = format(new Date(), "yyyy-MM-dd");
  const startHour = format(new Date(), "HH:mm");

  const gameplayTemplate: Gameplay = {
    date,
    location: table.location as number,
    playerCount: table.playerCount,
    startHour,
    mentor: "-",
  };

  return (
    <div className="bg-white rounded-md shadow overflow-y-auto sm:h-auto">
      <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
        <p className="text-base font-semibold">{table.name}</p>
        <div className="flex justify-end w-2/3 gap-4">
          <CardAction onClick={createGameplay} IconComponent={PlusIcon} />
          <CardAction onClick={createGameplay} IconComponent={PencilIcon} />
          <CardAction onClick={finishTable} IconComponent={FlagIcon} />
        </div>
      </div>
      <div className="px-4 md:px-10 md:pt-4 md:pb-4 pb-8">
        <div className="mt-2 flex gap-4	 flex-row">
          <InputWithLabel
            name="startTime"
            label="Start Time"
            type="time"
            value={table.startHour}
            readOnly
          />
          <InputWithLabel
            name="endTime"
            label="End Time"
            type="time"
            value={table.finishHour}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputWithLabel
            name="playerCount"
            label="Player Count"
            type="number"
            value={table.playerCount}
            readOnly
          />
        </div>
        <div className="flex flex-col-reverse gap-4">
          {table.gameplays.map((gameplay) => {
            return (
              <h1 key={gameplay._id}>{getGameName(gameplay.game as number)}</h1>
            );
          })}
        </div>
      </div>
      <GameplayDialog
        isOpen={isGameplayDialogOpen}
        close={() => setIsGameplayDialogOpen(false)}
        gameplay={selectedGameplay || gameplayTemplate}
        table={table}
        mentors={mentors}
        games={games}
      />
    </div>
  );
}

import { PlusIcon, PencilIcon, FlagIcon } from "@heroicons/react/solid";
import { FormEvent, useState } from "react";
import { Gameplay, Table, User, Game } from "../types";
import { GameplayDialog } from "./GameplayDialog";
import { InputWithLabel } from "./InputWithLabel";
import { CardAction } from "./CardAction";
import { format } from "date-fns";
import { getDuration } from "../utils/time";
import { useUpdateTableMutation } from "../utils/api/table";
import { useForm } from "../hooks/useForm";

export interface TableCardProps {
  table: Table;
  mentors: User[];
  games: Game[];
}

export function TableCard({ table, mentors, games }: TableCardProps) {
  const [isGameplayDialogOpen, setIsGameplayDialogOpen] = useState(false);
  const [selectedGameplay, setSelectedGameplay] = useState<Gameplay>();

  const bgColor = table.finishHour ? "bg-gray-100" : "bg-white";

  function createGameplay() {
    setSelectedGameplay(undefined);
    setIsGameplayDialogOpen(true);
  }

  const { data, handleUpdate } = useForm(table);

  const { mutate: updateTable } = useUpdateTableMutation();

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

  function updateTableHandler(event: FormEvent<HTMLInputElement>) {
    handleUpdate(event);
    const target = event.target as HTMLInputElement;

    updateTable({
      id: table._id!,
      updates: { [target.name]: target.valueAsNumber },
    });
  }

  return (
    <div className="bg-white rounded-md shadow overflow-y-auto sm:h-auto break-inside-avoid mb-4">
      <div className="bg-gray-200 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
        <p className="text-base font-semibold">{table.name}</p>
        <div className="flex justify-end w-2/3 gap-4">
          <CardAction onClick={createGameplay} IconComponent={PlusIcon} />
          <CardAction onClick={createGameplay} IconComponent={PencilIcon} />
          <CardAction onClick={finishTable} IconComponent={FlagIcon} />
        </div>
      </div>
      <div className={`px-4 md:px-10 md:pt-4 md:pb-4 pb-8 ${bgColor}`}>
        <div className="mt-2 flex gap-4	 flex-row">
          <InputWithLabel
            name="startTime"
            label="Start Time"
            type="time"
            value={table.startHour}
            readOnly
            bgColor={bgColor}
          />
          <InputWithLabel
            name="endTime"
            label="End Time"
            type="time"
            value={table.finishHour}
            readOnly
            bgColor={bgColor}
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputWithLabel
            name="playerCount"
            label="Player Count"
            type="number"
            defaultValue={table.playerCount}
            onChange={updateTableHandler}
            bgColor={bgColor}
          />
        </div>
        <div className="flex flex-col space-y-2 mt-2">
          {table.gameplays?.reverse().map((gameplay) => {
            return (
              <div
                key={gameplay._id || gameplay.startHour}
                className="flex justify-between text-xs"
              >
                <h1 className="text-xs">
                  {getGameName(gameplay.game as number)}
                </h1>
                <h5 className="text-xs">
                  {getDuration(gameplay.startHour, gameplay.finishHour)}
                </h5>
              </div>
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

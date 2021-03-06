import { PlusIcon, FlagIcon, TrashIcon } from "@heroicons/react/solid";
import { FormEvent, useRef, useState } from "react";
import { Gameplay, Table, User, Game } from "../types";
import { CreateGameplayDialog } from "./CreateGameplayDialog";
import { InputWithLabel } from "./InputWithLabel";
import { CardAction } from "./CardAction";
import { format } from "date-fns";
import { getDuration } from "../utils/time";
import {
  useDeleteTableMutation,
  useUpdateTableMutation,
} from "../utils/api/table";
import { EditGameplayDialog } from "./EditGameplayDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";

export interface TableCardProps {
  table: Table;
  mentors: User[];
  games: Game[];
}

export function TableCard({ table, mentors, games }: TableCardProps) {
  const [isGameplayDialogOpen, setIsGameplayDialogOpen] = useState(false);
  const [isEditGameplayDialogOpen, setIsEditGameplayDialogOpen] =
    useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [isEditTableNameActive, setIsEditTableNameActive] = useState(false);
  const [selectedGameplay, setSelectedGameplay] = useState<Gameplay>();
  const { mutate: deleteTable } = useDeleteTableMutation();

  const bgColor = table.finishHour ? "bg-gray-100" : "bg-white";

  function createGameplay() {
    setSelectedGameplay(undefined);
    setIsGameplayDialogOpen(true);
  }

  const { mutate: updateTable } = useUpdateTableMutation();

  function getGameName(id: number) {
    const game = games.find((game) => game._id === id);
    return game?.name || "";
  }

  function finishTable() {
    updateTable({
      id: table._id!,
      updates: { finishHour: format(new Date(), "HH:mm") },
    });
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
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    updateTable({
      id: table._id!,
      updates: { [target.name]: target.value },
    });
  }

  function editGameplay(gameplay: Gameplay) {
    setSelectedGameplay(gameplay);
    setIsEditGameplayDialogOpen(true);
  }

  function handleTableDelete() {
    if (!table._id) return;
    deleteTable({ id: table._id });
    setIsConfirmationDialogOpen(false);
  }

  const nameInput = useRef(null);

  return (
    <div className="bg-white rounded-md shadow overflow-y-auto sm:h-auto break-inside-avoid mb-4">
      <div className="bg-gray-200 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
        <p className="text-base font-semibold cursor-pointer">
          {!isEditTableNameActive ? (
            <span
              onClick={() => {
                setIsEditTableNameActive(true);
              }}
            >
              {table.name}
            </span>
          ) : (
            <input
              name="name"
              className={`${bgColor} w-full text-gray-600 border-0 border-b-[1px] dark:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 font-normal text-base border-gray-300`}
              placeholder={table.name}
              onChange={updateTableHandler}
              value={table.name}
              onBlur={() => setIsEditTableNameActive(false)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  setIsEditTableNameActive(false);
                }
              }}
              autoFocus
            />
          )}
        </p>
        <div className="flex justify-end w-2/3 gap-4">
          {!table.finishHour && (
            <CardAction onClick={createGameplay} IconComponent={PlusIcon} />
          )}
          {!table.finishHour && (
            <CardAction onClick={finishTable} IconComponent={FlagIcon} />
          )}
          <CardAction
            onClick={() => setIsConfirmationDialogOpen(true)}
            IconComponent={TrashIcon}
          />
        </div>
      </div>
      <div className={`px-4 md:px-10 md:pt-4 md:pb-4 pb-8 ${bgColor}`}>
        <div className="mt-2 flex gap-4	 flex-row">
          <InputWithLabel
            name="startHour"
            label="Start Time"
            type="time"
            value={table.startHour}
            onChange={updateTableHandler}
            bgColor={bgColor}
          />
          <InputWithLabel
            name="finishHour"
            label="End Time"
            type="time"
            value={table.finishHour}
            onChange={updateTableHandler}
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
                className="flex justify-between text-xs cursor-pointer"
                onClick={() => editGameplay(gameplay)}
              >
                <h1 className="text-xs">
                  {getGameName(gameplay.game as number)}
                </h1>
                <h5 className="text-xs">
                  {getDuration(
                    gameplay.startHour,
                    gameplay.finishHour,
                    new Date(gameplay.date)
                  )}
                </h5>
              </div>
            );
          })}
        </div>
      </div>
      <CreateGameplayDialog
        isOpen={isGameplayDialogOpen}
        close={() => setIsGameplayDialogOpen(false)}
        gameplay={selectedGameplay || gameplayTemplate}
        table={table}
        mentors={mentors}
        games={games}
      />
      {selectedGameplay && (
        <EditGameplayDialog
          isOpen={isEditGameplayDialogOpen}
          close={() => setIsEditGameplayDialogOpen(false)}
          gameplay={selectedGameplay}
          table={table}
          mentors={mentors}
          games={games}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        close={() => setIsConfirmationDialogOpen(false)}
        confirm={handleTableDelete}
        title="Delete Table"
        text=""
      />
    </div>
  );
}

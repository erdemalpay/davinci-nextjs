import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { InputWithLabel } from "./InputWithLabel";
import { Table, Gameplay, User, Game } from "../types";
import { useForm } from "../hooks/useForm";
import { useCreateGameplayMutation } from "../utils/api/gameplay";
import { Autocomplete } from "./Autocomplete";

export function CreateGameplayDialog({
  isOpen,
  close,
  gameplay,
  table,
  mentors,
  games,
}: {
  isOpen: boolean;
  close: () => void;
  gameplay?: Gameplay;
  table: Table;
  mentors: User[];
  games: Game[];
}) {
  const { data, setData, handleUpdate } = useForm(gameplay as Gameplay);

  const { mutate: createGameplay } = useCreateGameplayMutation();

  async function handleCreate() {
    // We were using async version to wait for response before closing
    // But since we are optimistically update data, that seemed redundant to me so I removed
    // May revert back later if needed
    createGameplay({ table: table._id as number, payload: data });
    close();
  }

  function handleMentorSelection(mentor: User) {
    setData({ ...data, mentor: mentor._id });
  }

  function handleGameSelection(game: Game) {
    setData({ ...data, game: game._id });
  }

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog onClose={() => close()}>
        <Dialog.Overlay />
        <div
          id="popup"
          className="z-20 fixed w-full flex justify-center inset-0"
        >
          <div
            onClick={close}
            className="w-full h-full bg-gray-500 bg-opacity-50 z-0 absolute inset-0"
          />
          <div className="mx-auto container">
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
                  <p className="text-base font-semibold">Create Gameplay</p>
                  <button onClick={close} className="focus:outline-none">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-4 md:px-10 md:pt-4 md:pb-4 pb-8">
                  <div>
                    <InputWithLabel
                      name="name"
                      label="Table Name"
                      type="text"
                      value={table.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <InputWithLabel
                      name="playerCount"
                      label="Player Count"
                      type="number"
                      value={data.playerCount}
                      onChange={handleUpdate}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      name="mentor"
                      label="Mentor"
                      suggestions={mentors}
                      handleSelection={handleMentorSelection}
                      initialValue={mentors.find(
                        (mentor) => mentor._id === "dv"
                      )}
                      showSelected
                    />
                  </div>
                  <div>
                    <Autocomplete
                      name="game"
                      label="Game"
                      suggestions={games}
                      handleSelection={handleGameSelection}
                      showSelected
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <InputWithLabel
                      name="startHour"
                      label="Start Time"
                      type="time"
                      defaultValue={data.startHour}
                      onChange={handleUpdate}
                    />
                    <InputWithLabel
                      name="finishHour"
                      label="End Time"
                      type="time"
                      defaultValue={data.finishHour}
                      onChange={handleUpdate}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-9">
                    <button
                      onClick={close}
                      className="px-6 py-3 bg-gray-400 hover:bg-gray-500 shadow rounded text-sm text-white"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3 bg-gray-800 hover:bg-opacity-80 shadow rounded text-sm text-white disabled:bg-gray-300"
                      onClick={handleCreate}
                      disabled={!(data.mentor && data.game && data.playerCount)}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

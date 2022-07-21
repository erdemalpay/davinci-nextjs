import { FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { InputWithLabel } from "./InputWithLabel";
import { Game, Gameplay, Table, User } from "../types";
import { useForm } from "../hooks/useForm";
import { useUpdateGameplayMutation } from "../utils/api/gameplay";
import { TimeInputWithLabel } from "./TimeInputWithLabel";
import { Autocomplete } from "./Autocomplete";

export function EditGameplayDialog({
  isOpen,
  close,
  table,
  gameplay,
  mentors,
  games,
}: {
  isOpen: boolean;
  close: () => void;
  table: Table;
  gameplay: Gameplay;
  mentors: User[];
  games: Game[];
}) {
  const { data, handleUpdate } = useForm(gameplay);

  const { mutate: updateGameplay } = useUpdateGameplayMutation();

  function updateGameplayHandler(event: FormEvent<HTMLInputElement>) {
    handleUpdate(event);
    const target = event.target as HTMLInputElement;

    updateGameplay({
      tableId: table._id!,
      id: gameplay._id!,
      updates: { [target.name]: target.value },
    });
  }

  function handleGameSelection(game: Game) {
    if (!game) return;
    updateGameplay({
      tableId: table._id!,
      id: gameplay._id!,
      updates: { game: game._id },
    });
  }

  const selectedGame = games.find((game) => game._id === gameplay.game!);

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
          className="z-50 fixed w-full flex justify-center inset-0"
        >
          <div
            onClick={close}
            className="w-full h-full bg-gray-900 bg-opacity-50 z-0 absolute inset-0"
          />
          <div className="mx-auto container">
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
                  <p className="text-base font-semibold">Update Gameplay</p>
                  <button onClick={close} className="focus:outline-none">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-4 md:px-10 md:pt-4 md:pb-4 pb-8">
                  <div className="flex flex-col gap-4">
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
                      <form autoComplete="off">
                        <Autocomplete
                          name="game"
                          label="Game"
                          suggestions={games}
                          handleSelection={handleGameSelection}
                          initialValue={selectedGame}
                          showSelected
                        />
                      </form>
                    </div>
                    <InputWithLabel
                      name="playerCount"
                      label="Player Count"
                      type="number"
                      defaultValue={data.playerCount}
                      onChange={updateGameplayHandler}
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <TimeInputWithLabel
                      name="startHour"
                      label="Start Time"
                      defaultValue={data.startHour}
                      onChange={updateGameplayHandler}
                    />
                    <TimeInputWithLabel
                      name="finishHour"
                      label="End Time"
                      defaultValue={data.finishHour}
                      onChange={updateGameplayHandler}
                    />
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

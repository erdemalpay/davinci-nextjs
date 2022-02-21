import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { InputWithLabel } from "./InputWithLabel";

export function CreateTableDialog({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
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
            className="w-full h-full bg-gray-900 z-0 absolute inset-0"
          />
          <div className="mx-auto container">
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
                  <p className="text-base font-semibold">Create New Table</p>
                  <button onClick={close} className="focus:outline-none">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-4 md:px-10 pt-6 md:pt-12 md:pb-4 pb-7">
                  <div className="mt-2 flex flex-col gap-4">
                    <InputWithLabel label="Table Name" type="text" />
                    <InputWithLabel
                      label="Player Count"
                      type="number"
                      min={1}
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <InputWithLabel label="Start Time" type="time" />
                    <InputWithLabel label="End Time" type="time" />
                  </div>
                  <div className="flex items-center justify-between mt-9">
                    <button
                      onClick={close}
                      className="px-6 py-3 bg-gray-400 hover:bg-gray-500 shadow rounded text-sm text-white"
                    >
                      Cancel
                    </button>
                    <button className="px-6 py-3 bg-indigo-700 hover:bg-opacity-80 shadow rounded text-sm text-white">
                      Create Table
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

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { useForm } from "../../hooks/useForm";
import { toast } from "react-toastify";
import { Input, Select } from "@material-tailwind/react";
import { UseMutateFunction } from "react-query";
import { MenuItem, MenuCategory } from "../../types/index";
import { InputWithLabel } from "../common/InputWithLabel";

export function AddMenuItemDialog({
  isOpen,
  close,
  createItem,
  category,
}: {
  isOpen: boolean;
  close: () => void;
  createItem: UseMutateFunction<MenuItem, unknown, Partial<MenuItem>>;
  category?: MenuCategory;
}) {
  const { data, handleUpdate } = useForm<Partial<MenuItem>>({
    name: "",
    category,
    priceBahceli: 0,
    priceNeorama: 0,
  });

  async function handleCreate() {
    createItem(data);
    toast.success(`New category created for ${data.name}`);
    close();
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
                  <p className="text-base font-semibold">Create Item</p>
                  <button onClick={close} className="focus:outline-none">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-4 lg:px-10 flex flex-col mt-4 gap-2">
                  <Input
                    variant="standard"
                    name="name"
                    label="Name"
                    type="text"
                    value={data.name}
                    onChange={handleUpdate}
                  />
                  <InputWithLabel
                    name="category"
                    label="Category"
                    value={category?.name || ""}
                    readOnly
                  />
                  <Input
                    variant="standard"
                    name="priceBahceli"
                    label="Price in Bahçeli"
                    type="number"
                    value={data.priceBahceli}
                    onChange={handleUpdate}
                  />
                  <Input
                    variant="standard"
                    name="priceNeorama"
                    label="Price in Neorama"
                    type="number"
                    value={data.priceNeorama}
                    onChange={handleUpdate}
                  />
                  <div className="flex items-center justify-between my-4">
                    <button
                      onClick={close}
                      className="px-6 py-3 bg-gray-400 hover:bg-gray-500 shadow rounded text-sm text-white"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3 bg-gray-800 hover:bg-opacity-80 shadow rounded text-sm text-white disabled:bg-gray-300"
                      onClick={handleCreate}
                      disabled={
                        !data.name ||
                        !data.category ||
                        !data.priceBahceli ||
                        !data.priceNeorama
                      }
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

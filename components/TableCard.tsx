import { PlusIcon } from "@heroicons/react/solid";
import { PencilIcon } from "@heroicons/react/solid";
import { Table } from "../types";
import { InputWithLabel } from "./InputWithLabel";

export interface TableCardProps {
  table: Table;
}

export function TableCard({ table }: TableCardProps) {
  return (
    <div className="bg-white rounded-md shadow overflow-y-auto sm:h-auto">
      <div className="bg-gray-100 rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
        <p className="text-base font-semibold">{table.name}</p>
        <button
          onClick={() => console.log("click!")}
          className="focus:outline-none"
        >
          <PencilIcon className="h-6 w-6" />
        </button>
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
      </div>
    </div>
  );
}

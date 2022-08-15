import { InputWithLabelProps } from "../common/InputWithLabel";
import { Chip } from "@material-tailwind/react";
import { Visit } from "../../types";

interface PreviousVisitListProps {
  visits: Visit[];
}

export function PreviousVisitList({ visits }: PreviousVisitListProps) {
  return visits?.length ? (
    <div className="flex flex-col lg:flex-row w-full gap-2">
      <label
        htmlFor="mentors"
        className="flex text-gray-800 dark:text-gray-100 text-sm items-center"
      >
        {"Who's at cafe:"}
      </label>
      <div className="flex flex-wrap gap-4 mt-2" id="mentors">
        {visits.map((visit) => (
          <Chip
            key={visit.user._id}
            value={visit.user.name}
            color="blue-grey"
          />
        ))}
      </div>
    </div>
  ) : null;
}

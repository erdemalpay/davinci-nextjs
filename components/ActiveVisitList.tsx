import { useState, useEffect, useContext } from "react";
import { Autocomplete } from "./Autocomplete";
import { InputWithLabelProps } from "./InputWithLabel";
import { Chip } from "@material-tailwind/react";
import {
  useCreateVisitMutation,
  useFinishVisitMutation,
} from "../utils/api/visit";
import { User, Visit } from "../types";
import { LocationContext } from "../context/LocationContext";

interface ActiveMentorListProps extends InputWithLabelProps {
  suggestions: User[];
  visits: Visit[];
}

export function ActiveVisitList({
  name,
  label,
  suggestions,
  visits,
}: ActiveMentorListProps) {
  const { mutate: createVisit } = useCreateVisitMutation();
  const { mutate: finishVisit } = useFinishVisitMutation();

  const { selectedLocationId } = useContext(LocationContext);

  const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);

  function handleChipClose(visit: Visit) {
    finishVisit({ id: visit._id });
    // setItems(items.filter((t) => t._id !== user._id));
  }

  function handleSelection(item: User) {
    createVisit({
      user: item,
      location: selectedLocationId,
    });
    // setItems([...items, item]);
  }

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter(
        (s) =>
          !visits
            .map((visit) => !visit.finishHour && visit.user._id)
            .includes(s._id) && s.name !== "-"
      )
    );
  }, [suggestions, visits]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col lg:flex-row w-full">
        <Autocomplete
          handleSelection={handleSelection}
          suggestions={filteredSuggestions}
          name={name}
          label={label}
        />
      </div>
      <div className="flex flex-wrap gap-4 mt-2">
        {visits.map((visit) => (
          <Chip
            key={visit.user._id}
            value={visit.user.name}
            color="blue-grey"
            dismissible={{ onClose: () => handleChipClose(visit) }}
          />
        ))}
      </div>
    </div>
  );
}

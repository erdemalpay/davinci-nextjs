import { useState, useEffect } from "react";
import { Autocomplete } from "./Autocomplete";
import { InputWithLabelProps } from "./InputWithLabel";
import { Chip } from "./Chip";
import { TagType } from "../types";

interface TagListWithAutocompleteProps<T> extends InputWithLabelProps {
  suggestions: T[];
  items: T[];
  setItems: (items: T[]) => void;
}

export function TagListWithAutocomplete<T>({
  name,
  label,
  suggestions,
  items,
  setItems,
}: TagListWithAutocompleteProps<TagType<T>>) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<TagType<T>[]>(
    []
  );

  function handleChipClose(tag: TagType<T>) {
    setItems(items.filter((t) => t._id !== tag._id));
  }

  function handleSelection(item: TagType<T>) {
    setItems([...items, item]);
  }

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter(
        (s) => !items.map((t) => t._id).includes(s._id) && s.name !== "-"
      )
    );
  }, [suggestions, items]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        <Autocomplete
          handleSelection={handleSelection}
          suggestions={filteredSuggestions}
          name={name}
          label={label}
        />
      </div>
      <div className="flex gap-4 mt-2">
        {items.map((tag) => (
          <Chip key={tag._id} item={tag} close={handleChipClose} />
        ))}
      </div>
    </div>
  );
}

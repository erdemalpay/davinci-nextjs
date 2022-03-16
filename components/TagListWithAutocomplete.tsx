import { useState, useEffect } from "react";
import { Autocomplete } from "./Autocomplete";
import { InputWithLabelProps } from "./InputWithLabel";
import { Chip } from "./Chip";
import { TagType } from "../types";

interface TagListWithAutocompleteProps<T> extends InputWithLabelProps {
  suggestions: T[];
}

export function TagListWithAutocomplete<T>({
  name,
  label,
  suggestions,
}: TagListWithAutocompleteProps<TagType<T>>) {
  const [tags, setTags] = useState<TagType<T>[]>([]);

  const [filteredSuggestions, setFilteredSuggestions] = useState<TagType<T>[]>(
    []
  );

  function handleChipClose(tag: TagType<T>) {
    setTags(tags.filter((t) => t._id !== tag._id));
  }

  function handleSelection(item: TagType<T>) {
    setTags([...tags, item]);
  }

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter(
        (s) => !tags.map((t) => t._id).includes(s._id) && s.name !== "-"
      )
    );
  }, [suggestions, tags]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full">
        <Autocomplete
          handleSelection={handleSelection}
          suggestions={filteredSuggestions}
          name={name}
          label={label}
        />
      </div>
      <div className="flex gap-4 mt-2">
        {tags.map((tag) => (
          <Chip key={tag._id} item={tag} close={handleChipClose} />
        ))}
      </div>
    </div>
  );
}

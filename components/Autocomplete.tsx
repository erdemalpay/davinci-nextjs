import { InputWithLabel, InputWithLabelProps } from "./InputWithLabel";
import { forwardRef, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { TagType } from "../types";

interface AutocompleteProps<T> extends InputWithLabelProps {
  suggestions: T[];
  handleSelection: (item: T) => void;
}

const ForwardedInputWithLabel = forwardRef(InputWithLabel);

export function Autocomplete<T>({
  suggestions,
  name,
  label,
  handleSelection,
}: AutocompleteProps<TagType<T>>) {
  const [selected, setSelected] = useState<T>();
  const [query, setQuery] = useState("");

  const filteredSuggestions =
    query === ""
      ? suggestions
      : suggestions.filter((suggestion: TagType<T>) => {
          return suggestion.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""));
        });

  return (
    <div className="w-full flex">
      <Combobox value={selected} onChange={handleSelection}>
        <div className="relative mt-1 w-full">
          <div className="relative w-full text-left bg-white rounded-lg cursor-default sm:text-sm overflow-hidden">
            <Combobox.Input
              as={Fragment}
              displayValue={(suggestion: TagType<T>) => suggestion.name}
              onChange={(event) => setQuery(event.target.value)}
            >
              <ForwardedInputWithLabel
                className="w-full focus:border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-0"
                name={name}
                label={label}
                value={query}
              />
            </Combobox.Input>
            <Combobox.Button className="absolute bottom-2 right-0 flex items-center pr-2">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredSuggestions.length === 0 && query !== "" ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredSuggestions.map((suggestion) => (
                  <Combobox.Option
                    key={suggestion._id}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 text-gray-900 ${
                        active && "bg-gray-100"
                      }`
                    }
                    value={suggestion}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {suggestion.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

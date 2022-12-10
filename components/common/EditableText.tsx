import { Tooltip } from "@material-tailwind/react";
import { FormEvent, useState } from "react";

interface Props<T> {
  text: string;
  onUpdate: (_: FormEvent<HTMLInputElement>, item?: T) => void;
  name: string;
  item?: T;
  type?: string;
}

export function EditableText<T>({
  text,
  onUpdate,
  item,
  name,
  type = "text",
}: Props<T>) {
  const [isEditActive, setIsEditActive] = useState(false);
  const [value, setValue] = useState(text);

  return !isEditActive ? (
    <Tooltip content="Click to edit">
      <span
        className="cursor-pointer"
        onClick={() => {
          setIsEditActive(true);
        }}
      >
        {type === "phone"
          ? `(${text.slice(0, 4)} ${text.slice(4, 7)} ${text.slice(
              7,
              9
            )} ${text.slice(9, 11)})`
          : text}
      </span>
    </Tooltip>
  ) : (
    <input
      name={name}
      className="bg-white text-gray-600 border-0 border-b-[1px] focus:outline-none font-normal text-base border-gray-300"
      placeholder={text}
      type={type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={(event) => {
        onUpdate(event, item);
        setIsEditActive(false);
      }}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          onUpdate(event, item);
          setIsEditActive(false);
        }
      }}
      autoFocus
    />
  );
}

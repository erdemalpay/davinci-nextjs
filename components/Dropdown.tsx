import { PropsWithChildren, useState } from "react";

interface DropdownProps {
  text: string;
}

interface DropdownItemProps {
  text: string;
  onClick: () => void;
}

export function DropdownItem({ text, onClick }: DropdownItemProps) {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none"
    >
      <span className="ml-2">{text}</span>
    </li>
  );
}

export function Dropdown({ text, children }: PropsWithChildren<DropdownProps>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full flex">
      <div
        aria-haspopup="true"
        className="cursor-pointer hidden xl:flex items-center pl-8 relative"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ul className="p-2 w-40 border-r bg-white absolute rounded z-40 left-0 shadow mt-40 ">
            {children}
          </ul>
        ) : (
          ""
        )}
        <p className="text-white text-sm ml-2">{text}</p>
      </div>
    </div>
  );
}

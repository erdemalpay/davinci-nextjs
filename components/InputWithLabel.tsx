import { DateInput } from "./DateInput";

export type InputType = "date" | "autocomplete" | "text" | "number" | "time";

export interface InputWithLabelProps {
  name: string;
  label: string;
  type?: InputType;
  id?: string;
  readOnly?: boolean;
  className?: string;
  min?: number;
  value?: string | number;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
}

export function InputWithLabel({
  label,
  type = "text",
  id = label.toLowerCase(),
  onChange,
  min = 1,
  ...props
}: InputWithLabelProps) {
  return (
    <div className="relative mt-4 w-full">
      <input
        id={id}
        {...props}
        type={type}
        className="w-full text-gray-600 border-0 border-b-[1px] dark:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 bg-white font-normal h-10 text-base border-gray-300"
        placeholder=""
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className="text-gray-800 dark:text-gray-100 text-xs absolute left-0 -top-2.5"
      >
        {label}
      </label>
    </div>
  );
}

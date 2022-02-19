import { DateInput } from "./DateInput";

export type InputType = "date" | "autocomplete" | "text" | "number" | "time";

export interface LabelWrapperProps {
  label: string;
  type?: InputType;
  id?: string;
  readOnly?: boolean;
  className?: string;
  min?: number;
}

export function InputWithLabel({
  label,
  type = "text",
  id = label.toLowerCase(),
  ...props
}: LabelWrapperProps) {
  return (
    <div className="relative md:pr-16 mt-4 w-full">
      <input
        id={id}
        {...props}
        type={type}
        className="w-full peer placeholder-transparent text-gray-600 border-0 border-b-[1px] dark:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 bg-white font-normal h-10 text-base border-gray-300"
        placeholder=""
      />
      <label
        htmlFor={id}
        className="text-gray-800 dark:text-gray-100 text-xs absolute left-0 -top-3.5 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

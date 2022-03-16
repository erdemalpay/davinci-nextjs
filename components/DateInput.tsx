import DatePicker from "react-datepicker";
import { useState } from "react";

export function DateInput({ ...props }) {
  const [date, setDate] = useState(new Date());
  return (
    <div className="relative mt-10 h-full">
      <DatePicker
        {...props}
        className="border-0 border-b-2 text-2xl peer placeholder-transparent"
        selected={date}
        onChange={(date) => setDate(date as Date)}
        nextMonthButtonLabel=">"
        previousMonthButtonLabel="<"
        popperClassName="react-datepicker-left"
      />
      <label
        htmlFor="date"
        className="text-gray-800 dark:text-gray-100 text-xs absolute left-0 -top-3.5 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-xs"
      >
        Date
      </label>
    </div>
  );
}

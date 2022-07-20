import { createContext } from "react";

type SelectedDateContextType = {
  setSelectedDate: (date: Date) => void;
  selectedDate?: Date;
};

export const SelectedDateContext = createContext<SelectedDateContextType>({
  setSelectedDate: () => {},
  selectedDate: undefined,
});

import { createContext } from "react";
import { Location } from "../types";

type LocationContextType = {
  locations: Location[];
  selectedLocation?: Location;
  setSelectedLocation: (location: Location) => void;
};

export const LocationContext = createContext<LocationContextType>({
  locations: [],
  setSelectedLocation: () => {},
});

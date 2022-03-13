import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import { Dropdown, DropdownItem } from "./Dropdown";

export function LocationSelector() {
  const { setSelectedLocation, selectedLocation, locations } =
    useContext(LocationContext);
  return (
    <Dropdown text={selectedLocation?.name || ""}>
      {locations.map((location, index) => {
        return (
          <DropdownItem
            key={location.name}
            onClick={() => setSelectedLocation(locations[index])}
            text={location.name}
          />
        );
      })}
    </Dropdown>
  );
}

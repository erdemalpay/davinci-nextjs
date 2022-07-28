import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export function LocationSelector() {
  const { setSelectedLocation, selectedLocation, locations } =
    useContext(LocationContext);
  return (
    <Menu>
      <MenuHandler>
        <button className="text-sm border-2 rounded p-2 text-white">
          {selectedLocation?.name}
        </button>
      </MenuHandler>
      <MenuList>
        {locations.map((location, index) => {
          return (
            <MenuItem
              key={location.name}
              onClick={() => setSelectedLocation(locations[index])}
            >
              {location.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/router";

export function LocationSelector() {
  const { setSelectedLocation, selectedLocation, locations } =
    useContext(LocationContext);
  const router = useRouter();
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
              onClick={() => {
                setSelectedLocation(locations[index]);
                router.push(`/home/${location._id}`);
              }}
            >
              {location.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useGetLocations } from "../utils/api/location";

export function LocationSelector() {
  const { setSelectedLocationId, selectedLocationId } =
    useContext(LocationContext);
  const { locations } = useGetLocations();
  const router = useRouter();
  if (!locations) return null;
  const selectedLocation = locations?.find(
    (location) => location._id === selectedLocationId
  );
  return (
    <Menu>
      <MenuHandler>
        <button className="text-sm border-2 rounded p-2 text-white">
          {selectedLocation?.name}
        </button>
      </MenuHandler>
      <MenuList>
        {locations.map((location) => {
          return (
            <MenuItem
              key={location.name}
              onClick={() => {
                // setSelectedLocationId(location._id);
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
